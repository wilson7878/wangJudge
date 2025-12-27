import React from 'react';
import { CaseData, ActiveSide } from '../types';
import { CheckCircle2, Edit3, ArrowRight } from 'lucide-react';

interface InputSectionProps {
  caseData: CaseData;
  onSelectSide: (side: ActiveSide) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ caseData, onSelectSide }) => {
  const hasA = caseData.complaintA.trim().length > 0;
  const hasB = caseData.complaintB.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Side A Button */}
        <button 
          onClick={() => onSelectSide('A')}
          className={`group clay-card p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 min-h-[240px] relative overflow-hidden ${hasA ? 'bg-blue-100/50' : 'bg-white'}`}
        >
           {/* Status Indicator */}
           <div className="absolute top-4 right-4">
            {hasA ? (
              <CheckCircle2 className="w-8 h-8 text-green-500 fill-green-100" />
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-50"></div>
            )}
           </div>

           <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🐶</div>
           <h3 className="text-2xl font-bold text-blue-800 mb-2">汪汪队 A</h3>
           <p className="text-blue-600/60 mb-6 font-medium">
             {hasA ? "证词已封存 (File Sealed)" : "点击填写委屈 (Enter Plea)"}
           </p>
           
           <div className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${hasA ? 'bg-blue-200 text-blue-800' : 'bg-blue-500 text-white group-hover:bg-blue-600'}`}>
             {hasA ? <><Edit3 className="w-4 h-4" /> 修改证词</> : <><ArrowRight className="w-4 h-4" /> 开始填写</>}
           </div>
        </button>

        {/* Side B Button */}
        <button 
          onClick={() => onSelectSide('B')}
          className={`group clay-card p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 min-h-[240px] relative overflow-hidden ${hasB ? 'bg-pink-100/50' : 'bg-white'}`}
        >
           {/* Status Indicator */}
           <div className="absolute top-4 right-4">
            {hasB ? (
              <CheckCircle2 className="w-8 h-8 text-green-500 fill-green-100" />
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-50"></div>
            )}
           </div>

           <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🐱</div>
           <h3 className="text-2xl font-bold text-pink-800 mb-2">汪汪队 B</h3>
           <p className="text-pink-600/60 mb-6 font-medium">
             {hasB ? "证词已封存 (File Sealed)" : "点击填写委屈 (Enter Plea)"}
           </p>

           <div className={`px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${hasB ? 'bg-pink-200 text-pink-800' : 'bg-pink-500 text-white group-hover:bg-pink-600'}`}>
             {hasB ? <><Edit3 className="w-4 h-4" /> 修改证词</> : <><ArrowRight className="w-4 h-4" /> 开始填写</>}
           </div>
        </button>

      </div>
      
      {!hasA && !hasB && (
        <p className="text-center mt-8 text-amber-800/40 font-medium animate-pulse">
          请双方分别点击上方卡片，在私密空间填写各自的想法...
        </p>
      )}
      {(hasA || hasB) && !(hasA && hasB) && (
        <p className="text-center mt-8 text-amber-800/60 font-bold">
          等待另一方填写...
        </p>
      )}
    </div>
  );
};