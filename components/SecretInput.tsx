import React from 'react';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';

interface SecretInputProps {
  side: 'A' | 'B';
  value: string;
  isSealed: boolean;
  onChange: (val: string) => void;
  onToggleSeal: () => void;
  onBack: () => void;
}

export const SecretInput: React.FC<SecretInputProps> = ({ side, value, isSealed, onChange, onToggleSeal, onBack }) => {
  const isA = side === 'A';
  const label = isA ? '汪汪队 A (委屈方)' : '汪汪队 B (委屈方)';
  const bgClass = isA ? 'bg-blue-50' : 'bg-pink-50';
  const ringClass = isA ? 'focus:ring-blue-200' : 'focus:ring-pink-200';
  
  return (
    <div className="w-full max-w-2xl mx-auto px-4 animate-pop">
      <div className="mb-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center text-amber-800/60 hover:text-amber-800 font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> 返回 (Back)
        </button>
        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${isA ? 'bg-blue-400' : 'bg-pink-400'}`}>
          {isSealed ? "LOCKED & SYNCED" : "DRAFT MODE"}
        </div>
      </div>

      <div className={`clay-card p-6 ${bgClass} flex flex-col items-center min-h-[60vh]`}>
        <div className={`mb-6 text-2xl font-bold ${isA ? 'text-blue-600' : 'text-pink-600'} flex items-center gap-2`}>
          {isA ? '🐶' : '🐱'} {label}
        </div>
        
        <div className="w-full flex-1 flex flex-col relative">
          <label className="text-amber-800/50 text-sm font-bold mb-2 ml-1">
            请写下你的委屈 (对方暂时看不到哦):
          </label>
          <textarea
            disabled={isSealed}
            className={`w-full flex-1 p-6 rounded-2xl bg-white/60 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 ${ringClass} transition-all resize-none clay-input text-lg leading-relaxed ${isSealed ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={isA ? "A同学，这里是你的秘密树洞..." : "B同学，这里是你的秘密树洞..."}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus={!isSealed}
          />
          {isSealed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Lock className="w-16 h-16 text-amber-900/10" />
            </div>
          )}
        </div>

        <button
          onClick={onToggleSeal}
          className={`mt-6 w-full clay-button font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all
            ${isSealed 
              ? 'bg-amber-200 text-amber-800' 
              : 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'}`}
        >
          {isSealed ? (
            <>
              <Unlock className="w-5 h-5" /> 修改证词 (Unlock to Edit)
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" /> 封存证词 (Seal Evidence)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
