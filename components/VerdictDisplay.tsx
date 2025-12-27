import React from 'react';
import { Scroll, HeartHandshake } from 'lucide-react';

interface VerdictDisplayProps {
  verdict: string;
  onReset: () => void;
}

export const VerdictDisplay: React.FC<VerdictDisplayProps> = ({ verdict, onReset }) => {
  // Simple parsing to wrap sections in styled divs for better reading
  const formattedVerdict = verdict.split('\n').map((line, index) => {
    if (line.includes('【') && line.includes('】')) {
      return <h3 key={index} className="text-xl font-bold text-amber-800 mt-6 mb-2">{line}</h3>;
    }
    return <p key={index} className="mb-2 text-amber-900/80 leading-relaxed">{line}</p>;
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8 animate-pop pb-12">
      <div className="relative bg-[#FFF8DC] p-8 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.1)] transform rotate-1 border-t-8 border-b-8 border-amber-200">
        
        {/* Paper texture effect overlay (subtle) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"></div>

        <div className="flex justify-between items-center mb-6 border-b-2 border-amber-200/50 pb-4">
          <div className="flex items-center gap-2">
            <Scroll className="text-amber-600" />
            <span className="font-bold text-amber-800 uppercase tracking-widest text-sm">Case Verdict</span>
          </div>
          <div className="text-amber-400 text-xs font-mono">#JUDGE-WANG-001</div>
        </div>

        <div className="prose prose-amber max-w-none font-medium">
          {formattedVerdict}
        </div>

        <div className="mt-8 pt-6 border-t-2 border-dashed border-amber-300 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 mb-2 rounded-full border-4 border-red-400/30 flex items-center justify-center transform -rotate-12 opacity-80">
             <span className="text-red-500 font-bold text-lg border-2 border-red-500 px-2 py-1 rounded">CASE CLOSED</span>
          </div>
          <p className="text-xs text-amber-500/60 font-mono mb-4">Signed by Judge Wang 🐾</p>
          
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors font-bold text-sm"
          >
            <HeartHandshake className="w-4 h-4" />
            审理下一案
          </button>
        </div>
      </div>
    </div>
  );
};