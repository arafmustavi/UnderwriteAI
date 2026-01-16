import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Terminal, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage, Theme } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  theme: Theme;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, theme }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSpace = theme === 'space';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const text = input;
    setInput('');
    await onSendMessage(text);
  };

  // Theme Classes
  const containerClass = isSpace 
    ? 'bg-slate-900/60 backdrop-blur-md border-white/10 shadow-2xl' 
    : 'bg-white border-slate-200 shadow-sm';
  const headerClass = isSpace 
    ? 'bg-slate-900/80 border-white/10' 
    : 'bg-slate-50 border-slate-200';
  const chatAreaClass = isSpace 
    ? 'bg-slate-950/30' 
    : 'bg-slate-50/50';

  return (
    <div className={`flex flex-col h-full rounded-xl border overflow-hidden relative ${containerClass}`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${headerClass}`}>
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md border ${isSpace ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-blue-100 border-blue-200'}`}>
                <Bot className={`w-4 h-4 ${isSpace ? 'text-cyan-400' : 'text-blue-600'}`} />
            </div>
            <h3 className={`font-semibold text-sm tracking-wide ${isSpace ? 'text-slate-200' : 'text-slate-800'}`}>
                {isSpace ? 'AI UNDERWRITER' : 'Underwriting Assistant'}
            </h3>
        </div>
        {isSpace && (
            <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
            </div>
        )}
      </div>

      {/* Chat Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar ${chatAreaClass}`}>
        {messages.length === 0 && (
          <div className={`text-center text-sm mt-10 space-y-4 ${isSpace ? 'text-slate-500 opacity-70' : 'text-slate-400'}`}>
            <Terminal className={`w-8 h-8 mx-auto mb-2 ${isSpace ? 'text-slate-600' : 'text-slate-300'}`} />
            <p>{isSpace ? 'System Ready. Awaiting Queries.' : 'Ask questions about the loan profile.'}</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
                <span className={`px-2 py-1 rounded border text-xs ${isSpace ? 'bg-slate-800 border-white/5' : 'bg-white border-slate-200'}`}>Analyze DTI</span>
                <span className={`px-2 py-1 rounded border text-xs ${isSpace ? 'bg-slate-800 border-white/5' : 'bg-white border-slate-200'}`}>Verify Income</span>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? (isSpace 
                        ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-100 rounded-br-none shadow-[0_0_15px_rgba(8,145,178,0.1)] backdrop-blur-sm' 
                        : 'bg-blue-600 text-white rounded-br-none')
                  : (isSpace 
                        ? 'bg-slate-800/60 border border-white/10 text-slate-300 rounded-bl-none backdrop-blur-sm' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none')
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className={`rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-3 ${
                isSpace ? 'bg-slate-800/60 border border-white/10' : 'bg-white border border-slate-200'
            }`}>
              <Loader2 className={`w-3 h-3 animate-spin ${isSpace ? 'text-cyan-400' : 'text-blue-500'}`} />
              <span className={`text-xs font-medium ${isSpace ? 'text-cyan-400 font-mono tracking-wider' : 'text-slate-500'}`}>
                  {isSpace ? 'PROCESSING_QUERY...' : 'Analyzing...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${isSpace ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'}`}>
        <form onSubmit={handleSubmit} className="relative group">
            {isSpace && <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>}
            <div className="relative flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isSpace ? "Enter command or query..." : "Ask about the application..."}
                    className={`w-full pl-4 pr-12 py-3 rounded-lg border outline-none transition-all text-sm ${
                        isSpace 
                            ? 'bg-slate-950 border-white/10 focus:ring-0 focus:border-cyan-500/50 text-slate-200 placeholder:text-slate-600' 
                            : 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900'
                    }`}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`absolute right-1.5 top-1.5 bottom-1.5 p-2 rounded-md transition-all ${
                        isSpace 
                            ? 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white border border-cyan-500/30' 
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;