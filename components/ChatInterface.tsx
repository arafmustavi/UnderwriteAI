import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Terminal, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col h-full bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500/20 rounded-md border border-cyan-500/30">
                <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm tracking-wide">AI UNDERWRITER</h3>
        </div>
        <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-10 space-y-4 opacity-70">
            <Terminal className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p>System Ready. Awaiting Queries.</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
                <span className="px-2 py-1 bg-slate-800 rounded border border-white/5 text-xs">Analyze DTI</span>
                <span className="px-2 py-1 bg-slate-800 rounded border border-white/5 text-xs">Verify Income</span>
                <span className="px-2 py-1 bg-slate-800 rounded border border-white/5 text-xs">Risk Breakdown</span>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm backdrop-blur-sm border ${
                msg.role === 'user' 
                  ? 'bg-cyan-600/20 border-cyan-500/30 text-cyan-100 rounded-br-none shadow-[0_0_15px_rgba(8,145,178,0.1)]' 
                  : 'bg-slate-800/60 border-white/10 text-slate-300 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-800/60 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-3">
              <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />
              <span className="text-xs text-cyan-400 font-mono tracking-wider">PROCESSING_QUERY...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/80 border-t border-white/10">
        <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>
            <div className="relative flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter command or query..."
                    className="w-full bg-slate-950 pl-4 pr-12 py-3 rounded-lg border border-white/10 focus:ring-0 focus:border-cyan-500/50 outline-none transition-all text-sm text-slate-200 placeholder:text-slate-600"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 p-2 bg-cyan-600/20 text-cyan-400 rounded-md hover:bg-cyan-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-cyan-500/30"
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