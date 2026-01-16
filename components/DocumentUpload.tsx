import React, { useCallback } from 'react';
import { Upload, X, FileText, Image as ImageIcon, File, Cloud } from 'lucide-react';
import { UploadedFile, Theme } from '../types';

interface DocumentUploadProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  isAnalyzing: boolean;
  theme: Theme;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ files, setFiles, isAnalyzing, theme }) => {
  const isSpace = theme === 'space';

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles: UploadedFile[] = [];
      
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const reader = new FileReader();

        await new Promise<void>((resolve) => {
          reader.onload = (e) => {
            const result = e.target?.result as string;
            const base64Data = result.split(',')[1];
            
            newFiles.push({
              id: Math.random().toString(36).substring(7),
              name: file.name,
              type: file.type,
              data: base64Data,
              mimeType: file.type
            });
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, [setFiles]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className={`w-5 h-5 ${isSpace ? 'text-red-400' : 'text-red-500'}`} />;
    if (mimeType.includes('image')) return <ImageIcon className={`w-5 h-5 ${isSpace ? 'text-cyan-400' : 'text-blue-500'}`} />;
    return <File className={`w-5 h-5 ${isSpace ? 'text-slate-400' : 'text-slate-500'}`} />;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold flex items-center gap-2 ${isSpace ? 'text-slate-100' : 'text-slate-800'}`}>
            <Cloud className={isSpace ? "text-cyan-500" : "text-blue-600"} size={20}/>
            {isSpace ? 'Artifact Upload' : 'Documents'}
        </h2>
        <span className={`text-sm px-3 py-1 rounded-full ${isSpace ? 'text-slate-400 bg-slate-800/50 border border-white/5' : 'text-slate-500 bg-slate-100'}`}>
            {files.length} {isSpace ? 'files loaded' : 'files uploaded'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drop Zone */}
        <label 
          className={`group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden
            ${isSpace 
                ? (isAnalyzing ? 'bg-slate-900/20 border-slate-800 opacity-50' : 'border-slate-700 bg-slate-900/30 hover:border-cyan-500/50 hover:bg-cyan-500/5')
                : (isAnalyzing ? 'bg-slate-50 border-slate-200 opacity-50' : 'border-slate-300 hover:bg-slate-50 hover:border-blue-400')
            } ${isAnalyzing ? 'cursor-not-allowed' : ''}`}
        >
          {/* Animated Glow on Hover (Space) */}
          {!isAnalyzing && isSpace && <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-purple-500/0 to-cyan-500/0 group-hover:via-cyan-500/5 transition-all"></div>}
          
          <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
            <div className={`p-4 rounded-full mb-3 transition-colors ${
                isSpace 
                    ? (isAnalyzing ? 'bg-slate-800' : 'bg-slate-800 group-hover:bg-cyan-900/30') 
                    : 'bg-blue-50'
            }`}>
              <Upload className={`w-8 h-8 transition-colors ${
                  isSpace 
                    ? (isAnalyzing ? 'text-slate-600' : 'text-slate-400 group-hover:text-cyan-400')
                    : 'text-blue-600'
              }`} />
            </div>
            <p className={`mb-2 text-sm font-medium transition-colors ${isSpace ? 'text-slate-300 group-hover:text-cyan-200' : 'text-slate-700'}`}>
                {isSpace ? 'Drop files or click to initiate upload' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-slate-500">PDF, PNG, JPG (Max 10MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            multiple 
            accept="application/pdf,image/png,image/jpeg,image/webp" 
            onChange={handleFileChange}
            disabled={isAnalyzing}
          />
        </label>

        {/* File List */}
        <div className="h-48 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {files.length === 0 && (
                <div className={`h-full flex flex-col items-center justify-center text-sm ${
                    isSpace 
                        ? 'text-slate-500 border border-white/5 rounded-xl bg-slate-900/20' 
                        : 'text-slate-400 italic'
                }`}>
                    <p>{isSpace ? 'Awaiting data artifacts...' : 'No documents yet'}</p>
                </div>
            )}
            {files.map((file) => (
            <div key={file.id} className={`group flex items-center justify-between p-3 rounded-lg transition-all ${
                isSpace 
                    ? 'bg-slate-800/40 border border-white/5 hover:border-cyan-500/30 hover:bg-slate-800/60' 
                    : 'bg-white border border-slate-200 shadow-sm'
            }`}>
                <div className="flex items-center space-x-3 overflow-hidden">
                {getIcon(file.mimeType)}
                <span className={`text-sm font-medium truncate max-w-[150px] ${isSpace ? 'text-slate-200' : 'text-slate-700'}`}>{file.name}</span>
                </div>
                {!isAnalyzing && (
                  <button 
                    onClick={() => removeFile(file.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                        isSpace 
                            ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-400' 
                            : 'hover:bg-red-50 text-slate-400 hover:text-red-500'
                    }`}
                  >
                  <X className="w-4 h-4" />
                  </button>
                )}
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;