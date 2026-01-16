import React, { useState } from 'react';
import { UploadedFile, LoanProfile, ChatMessage, Theme } from './types';
import DocumentUpload from './components/DocumentUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import ChatInterface from './components/ChatInterface';
import { analyzeDocuments, chatWithUnderwriter } from './services/geminiService';
import { Activity, AlertCircle, Loader2, Sparkles, Rocket, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loanProfile, setLoanProfile] = useState<LoanProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('space');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === 'space' ? 'light' : 'space');
  };

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

  // Theme styles
  const isSpace = theme === 'space';
  const mainBg = isSpace ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900';
  const headerBg = isSpace ? 'bg-[#020617]/80 border-white/10' : 'bg-white/80 border-slate-200';
  const logoText = isSpace ? 'text-white' : 'text-slate-900';
  const accentText = isSpace ? 'bg-gradient-to-r from-cyan-400 to-purple-400' : 'text-blue-600';

  return (
    <div className={`min-h-screen font-sans pb-10 relative overflow-x-hidden transition-colors duration-500 ${mainBg}`}>
      
      {/* Space Background Effects (Only in Space Mode) */}
      {isSpace && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/0 via-slate-900/0 to-[#020617]"></div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={resetApp}>
            {isSpace ? (
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative bg-slate-900 p-2 rounded-lg border border-white/10 text-cyan-400">
                        <Rocket size={20} className="transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            ) : (
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <Activity size={20} />
                </div>
            )}
            <h1 className={`text-xl font-bold tracking-tight ${logoText}`}>
                Underwrite<span className={isSpace ? "text-transparent bg-clip-text " + accentText : "text-blue-600"}>AI</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
             {loanProfile && (
                <button 
                  onClick={resetApp}
                  className={`px-4 py-2 text-sm font-medium transition-colors border border-transparent rounded-lg ${
                      isSpace ? 'text-slate-400 hover:text-white hover:border-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  New {isSpace ? 'Mission' : 'Application'}
                </button>
             )}
             
             {/* Theme Toggle Radio/Switch */}
             <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${
                    isSpace 
                    ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title="Toggle Theme"
             >
                 {isSpace ? <Sun size={20} /> : <Moon size={20} />}
             </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Upload Section */}
        {!loanProfile && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-4 pt-10">
              {isSpace && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium uppercase tracking-wider mb-2">
                    <Sparkles size={12} /> Next Gen Processing
                  </div>
              )}
              <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${isSpace ? 'text-white' : 'text-slate-900'}`}>
                Intelligent <span className={isSpace ? `text-transparent bg-clip-text ${accentText}` : 'text-blue-600'}>Underwriting</span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isSpace ? 'text-slate-400' : 'text-slate-600'}`}>
                {isSpace 
                    ? "Initialize loan analysis sequence. Upload financial artifacts for instant extraction, risk vector calculation, and profile synthesis."
                    : "Upload bank statements, pay stubs, and ID documents. We'll extract the data, calculate risk, and generate a comprehensive loan profile instantly."}
              </p>
            </div>

            <div className={isSpace ? "bg-slate-900/50 p-1 rounded-2xl border border-white/10 shadow-2xl shadow-purple-900/20 backdrop-blur-sm" : "bg-white p-8 rounded-2xl shadow-sm border border-slate-200"}>
                <div className={isSpace ? "bg-[#020617]/80 p-8 rounded-xl border border-white/5" : ""}>
                    <DocumentUpload 
                        files={files} 
                        setFiles={setFiles} 
                        isAnalyzing={isAnalyzing} 
                        theme={theme}
                    />
                    
                    <div className="mt-8 flex justify-end">
                        <button
                        onClick={handleAnalyze}
                        disabled={files.length === 0 || isAnalyzing}
                        className={`
                            relative overflow-hidden group flex items-center gap-3 px-8 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                            ${isSpace 
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-900/20 hover:shadow-cyan-500/20' 
                                : 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700'}
                        `}
                        >
                        {isSpace && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                        {isAnalyzing ? (
                            <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="relative z-10">{isSpace ? 'Analyzing Artifacts...' : 'Analyzing Documents...'}</span>
                            </>
                        ) : (
                            <>
                            <Activity className="w-5 h-5" />
                            <span className="relative z-10">{isSpace ? 'Initialize Analysis' : 'Generate Loan Profile'}</span>
                            </>
                        )}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
              <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in ${isSpace ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'}`}>
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
               <AnalysisDashboard profile={loanProfile} theme={theme} />
            </div>
            <div className="xl:col-span-1 h-[600px] xl:h-[calc(100vh-8rem)] xl:sticky xl:top-24">
               <ChatInterface 
                 messages={messages} 
                 onSendMessage={handleSendMessage} 
                 isLoading={isChatLoading} 
                 theme={theme}
               />
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
};

export default App;