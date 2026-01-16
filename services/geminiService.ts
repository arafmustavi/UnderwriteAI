import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UploadedFile, LoanProfile, RiskLevel } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define the JSON schema for the loan profile
const loanProfileSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    applicant: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        currentAddress: { type: Type.STRING },
        employmentStatus: { type: Type.STRING },
        estimatedCreditScore: { type: Type.NUMBER, description: "Estimated score if found in documents, else null" },
      },
      required: ["fullName", "employmentStatus"],
    },
    income: {
      type: Type.OBJECT,
      properties: {
        sources: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING, description: "Employer name or income type" },
              amount: { type: Type.NUMBER, description: "Monthly amount" },
              frequency: { type: Type.STRING, description: "Pay frequency (e.g., Bi-weekly, Monthly)" },
              verified: { type: Type.BOOLEAN, description: "Does the document explicitly verify this?" },
            },
          },
        },
        totalMonthlyIncome: { type: Type.NUMBER },
      },
      required: ["sources", "totalMonthlyIncome"],
    },
    liabilities: {
      type: Type.OBJECT,
      properties: {
        debts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              amount: { type: Type.NUMBER, description: "Monthly payment amount" },
              creditor: { type: Type.STRING },
            },
          },
        },
        totalMonthlyDebt: { type: Type.NUMBER },
      },
      required: ["debts", "totalMonthlyDebt"],
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        debtToIncomeRatio: { type: Type.NUMBER, description: "Calculated DTI percentage (0-100)" },
        disposableIncome: { type: Type.NUMBER },
      },
      required: ["debtToIncomeRatio", "disposableIncome"],
    },
    riskAssessment: {
      type: Type.OBJECT,
      properties: {
        overallRisk: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL] },
        factors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              factor: { type: Type.STRING },
              severity: { type: Type.STRING, enum: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL] },
              description: { type: Type.STRING },
            },
          },
        },
        summary: { type: Type.STRING, description: "Executive summary of the risk profile." },
      },
      required: ["overallRisk", "factors", "summary"],
    },
    recommendation: {
      type: Type.OBJECT,
      properties: {
        decision: { type: Type.STRING, enum: ["APPROVE", "DENY", "MANUAL_REVIEW"] },
        reasoning: { type: Type.STRING },
        suggestedLoanAmount: { type: Type.NUMBER },
      },
      required: ["decision", "reasoning"],
    },
  },
};

export const analyzeDocuments = async (files: UploadedFile[]): Promise<LoanProfile> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const parts = files.map(file => ({
    inlineData: {
      mimeType: file.mimeType,
      data: file.data,
    }
  }));

  const prompt = `
    You are a Senior Loan Underwriter AI. 
    Analyze the attached financial documents (Pay stubs, Bank Statements, Tax Returns, ID, etc.).
    
    Your goal is to extract structured data to build a Loan Profile.
    1. Identify the applicant.
    2. Calculate monthly income (normalize to monthly if pay is bi-weekly/weekly).
    3. Identify recurring monthly debts/liabilities.
    4. Calculate the Debt-to-Income (DTI) ratio.
    5. Assess risk factors (e.g., overdraft fees, irregular income, high DTI).
    6. Provide a recommendation.

    Be conservative in your estimates. If data is ambiguous, flag it in the risk assessment.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for complex document reasoning
      contents: {
        role: 'user',
        parts: [
          { text: prompt },
          ...parts
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: loanProfileSchema,
        thinkingConfig: { thinkingBudget: 4096 } // Add thinking for better math/logic verification
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as LoanProfile;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const chatWithUnderwriter = async (
  history: { role: 'user' | 'model', text: string }[],
  newMessage: string,
  files: UploadedFile[],
  currentProfile: LoanProfile | null
) => {
    if (!apiKey) throw new Error("API Key missing");

    const parts = files.map(file => ({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data,
        }
      }));

    const systemInstruction = `
      You are an expert Underwriting Assistant. 
      You have access to the user's uploaded documents and the generated loan profile: ${JSON.stringify(currentProfile)}.
      Answer questions specifically about these documents, the risk factors, or the underwriting decision.
      Be professional, concise, and helpful.
    `;

    // Convert simple history to Gemini Content format
    const chatHistory = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview', // Faster for chat
        config: {
            systemInstruction,
        },
        history: chatHistory
    });
    
    // Add the documents to the context of the *latest* message for reference if needed, 
    // though typically in a chat loop we might want to cache the context. 
    // For this stateless impl, we re-send docs or rely on the system instruction summary.
    // To properly "see" the docs in chat, we send them with the message.
    
    const response = await chat.sendMessage({
        role: 'user',
        parts: [
            ...parts, // Re-attach docs for context grounding in the current turn
            { text: newMessage }
        ]
    });

    return response.text;
};
