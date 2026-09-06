import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, FileCode, CheckCircle2 } from 'lucide-react';
import { standaloneHTML, standaloneCSS, standaloneJS } from '../data/standaloneCode';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode =
    activeTab === 'html' ? standaloneHTML : activeTab === 'css' ? standaloneCSS : standaloneJS;
  const filename =
    activeTab === 'html' ? 'index.html' : activeTab === 'css' ? 'style.css' : 'script.js';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = currentCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const files = [
      { name: 'index.html', content: standaloneHTML },
      { name: 'style.css', content: standaloneCSS },
      { name: 'script.js', content: standaloneJS },
    ];
    files.forEach((f, idx) => {
      setTimeout(() => {
        const blob = new Blob([f.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = f.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, idx * 250);
    });
  };

  return (
    <div
      id="code-export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        id="code-export-modal-content"
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-zinc-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 border-b border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                Pure HTML, CSS &amp; JS Files
              </h3>
              <p className="text-[11px] text-zinc-400">
                Zero dependencies &bull; 100% standalone 3-file friendship 3D scroll animation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/standalone/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-medium border border-cyan-500/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Standalone</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-2.5 border-b border-white/10 bg-zinc-900/40 text-xs">
          <div className="flex gap-2">
            {(['html', 'css', 'js'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white/15 text-cyan-300 border border-cyan-400/40'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'html' && 'index.html'}
                {tab === 'css' && 'style.css'}
                {tab === 'js' && 'script.js'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Copy Current</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white font-semibold text-xs transition-opacity cursor-pointer shadow-sm shadow-rose-500/20"
              title="Download index.html, style.css, and script.js"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download 3 Files</span>
            </button>
          </div>
        </div>

        {/* Code Display Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-zinc-950 font-mono text-xs text-zinc-300 leading-relaxed select-text">
          <pre className="overflow-x-auto whitespace-pre">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Quick Instructions Footer */}
        <div className="px-5 sm:px-7 py-3 bg-zinc-900/60 border-t border-white/10 text-[11px] text-zinc-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Save <strong>index.html</strong>, <strong>style.css</strong>, and <strong>script.js</strong> in the same directory and double-click to open in any browser!
            </span>
          </div>
          <button
            onClick={handleDownloadSingle}
            className="text-cyan-300 hover:underline cursor-pointer"
          >
            Download {filename} &darr;
          </button>
        </div>
      </div>
    </div>
  );
};
