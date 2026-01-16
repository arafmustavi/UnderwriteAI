# UnderwriteAI

UnderwriteAI is an intelligent loan underwriting assistant powered by Google Gemini 1.5 Pro. It analyzes financial documents (PDFs, Images), extracts data, calculates risk, and generates comprehensive loan profiles with visualizations.

## Features

- **Multi-Format Upload**: Support for PDF, PNG, and JPG financial documents.
- **AI Analysis**: Uses Gemini 1.5 Pro to extract applicant info, income, liabilities, and calculate DTI.
- **Risk Assessment**: Generates automatic risk vectors (Low to Critical) with explanations.
- **Visual Dashboard**: Interactive charts for financial health and liabilities.
- **AI Chat**: Ask questions about the specific loan profile (e.g., "Why is the risk high?").
- **Dual Themes**: Toggle between "Space Mode" (Futuristic) and "Regular Mode" (Corporate/Clean).

## Setup & Installation

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up API Key**:
    Ensure you have a Google Gemini API Key.
    Create a `.env` file:
    ```env
    API_KEY=your_gemini_api_key_here
    ```

## Running Locally

```bash
npm start
# or if using Vite
npm run dev
```

## Hosting on GitHub Pages

To host this React application on GitHub Pages:

1.  **Update `vite.config.ts`** (if using Vite) to set the base URL:
    ```typescript
    export default defineConfig({
      base: '/your-repo-name/',
      // ...
    })
    ```
2.  **Build the project**:
    ```bash
    npm run build
    ```
3.  **Deploy**:
    Upload the contents of the `dist` (or `build`) folder to the `gh-pages` branch of your repository.

## Technologies

- React 18
- Tailwind CSS
- Google GenAI SDK (`@google/genai`)
- Recharts (Visualization)
- Lucide React (Icons)
