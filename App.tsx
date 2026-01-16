import React, { useState } from 'react';
import { UploadedFile, LoanProfile, ChatMessage } from './types';
import DocumentUpload from './components/DocumentUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import ChatInterface from './components/ChatInterface';
import { analyzeDocuments, chatWithUnderwriter } from './services/geminiService';
import { Activity, AlertCircle, Loader2, Sparkles, Rocket } from 'lucide-react';

const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loanProfile, setLoanProfile] = useState<LoanProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    
    setIsAnalyzing(true);
    setError(null);
    setLoanProfile(null);
    
    try {
      const profile = await analyzeDocuments(files);
      setLoanProfile(profile);
      
      const initialMessage: ChatMessage = {
        id: 'init-1',
        role: 'model',
        text: `Analysis complete. I've reviewed the ${files.length} documents for ${profile.applicant.fullName}. The overall risk is assessed as ${profile.riskAssessment.overallRisk}. I am ready to answer specific queries regarding the file.`,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      
    } catch (err: any) {
      setError(err.message || "Failed to analyze documents. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setIsChatLoading(true);

    try {
        const history = messages.map(m => ({ role: m.role, text: m.text }));
        const responseText = await chatWithUnderwriter(history, text, files, loanProfile);
        
        const newModelMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText || "I couldn't generate a response.",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newModelMsg]);

    } catch (err) {
        console.error(err);
        const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: "Transmission error. Please retry query.",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const resetApp = () => {
    setFiles([]);
    setLoanProfile(null);
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-10 relative overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* Space Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/0 via-slate-900/0 to-[#020617]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={resetApp}>
            <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-slate-900 p-2 rounded-lg border border-white/10 text-cyan-400">
                    <Rocket size={20} className="transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Underwrite<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">AI</span></h1>
          </div>
          <div className="flex items-center gap-4">
             {loanProfile && (
                <button 
                  onClick={resetApp}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors border border-transparent hover:border-white/10 rounded-lg"
                >
                  New Mission
                </button>
             )}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Upload Section */}
        {!loanProfile && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 pt-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium uppercase tracking-wider mb-2">
                <Sparkles size={12} /> Next Gen Processing
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Underwriting</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Initialize loan analysis sequence. Upload financial artifacts for instant extraction, risk vector calculation, and profile synthesis.
              </p>
            </div>

            <div className="bg-slate-900/50 p-1 rounded-2xl border border-white/10 shadow-2xl shadow-purple-900/20 backdrop-blur-sm">
                <div className="bg-[#020617]/80 p-8 rounded-xl border border-white/5">
                <DocumentUpload 
                    files={files} 
                    setFiles={setFiles} 
                    isAnalyzing={isAnalyzing} 
                />
                
                <div className="mt-8 flex justify-end">
                    <button
                    onClick={handleAnalyze}
                    disabled={files.length === 0 || isAnalyzing}
                    className="relative overflow-hidden group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    {isAnalyzing ? (
                        <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="relative z-10">Analyzing Artifacts...</span>
                        </>
                    ) : (
                        <>
                        <Activity className="w-5 h-5" />
                        <span className="relative z-10">Initialize Analysis</span>
                        </>
                    )}
                    </button>
                </div>
                </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {loanProfile && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
               <AnalysisDashboard profile={loanProfile} />
            </div>
            <div className="xl:col-span-1 h-[600px] xl:h-[calc(100vh-8rem)] xl:sticky xl:top-24">
               <ChatInterface 
                 messages={messages} 
                 onSendMessage={handleSendMessage} 
                 isLoading={isChatLoading} 
               />
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
};

export default App;