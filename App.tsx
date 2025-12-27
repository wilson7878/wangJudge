import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { SecretInput } from './components/SecretInput';
import { VerdictDisplay } from './components/VerdictDisplay';
import { CaseData, CourtState, ActiveSide } from './types';
import { getVerdict } from './services/geminiService';
import { LOADING_MESSAGES } from './constants';
import { PawPrint, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [caseData, setCaseData] = useState<CaseData>({ complaintA: '', complaintB: '' });
  const [activeSide, setActiveSide] = useState<ActiveSide>(null);
  const [courtState, setCourtState] = useState<CourtState>(CourtState.IDLE);
  const [verdictText, setVerdictText] = useState<string>('');
  const [loadingMsg, setLoadingMsg] = useState<string>(LOADING_MESSAGES[0]);

  // Rotate loading messages
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (courtState === CourtState.THINKING) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[i]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [courtState]);

  const handleOpenCourt = async () => {
    if (!caseData.complaintA.trim() || !caseData.complaintB.trim()) {
      alert("请双方都陈述完冤情再开庭哦！(Please fill in both sides)");
      return;
    }

    setCourtState(CourtState.THINKING);

    try {
      const result = await getVerdict(caseData);
      setVerdictText(result);
      setCourtState(CourtState.VERDICT_READY);
    } catch (error) {
      setCourtState(CourtState.ERROR);
    }
  };

  const handleReset = () => {
    setCaseData({ complaintA: '', complaintB: '' });
    setVerdictText('');
    setCourtState(CourtState.IDLE);
    setActiveSide(null);
  };

  const isReady = caseData.complaintA.trim().length > 0 && caseData.complaintB.trim().length > 0;

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <Header />

      <main className="relative z-10 flex flex-col items-center w-full">
        {courtState === CourtState.IDLE && (
          <>
            {/* Dashboard View: Show Buttons if no side is active */}
            {activeSide === null && (
              <>
                <InputSection 
                  caseData={caseData} 
                  onSelectSide={setActiveSide} 
                />
                
                <div className="mt-12 mb-8 transition-all duration-500">
                  <button
                    onClick={handleOpenCourt}
                    disabled={!isReady}
                    className={`group relative clay-button text-xl font-bold px-12 py-4 rounded-full flex items-center gap-3 overflow-hidden transition-all duration-300 ${
                      isReady 
                        ? 'bg-gradient-to-b from-orange-400 to-orange-500 text-white opacity-100 translate-y-0 cursor-pointer' 
                        : 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed grayscale'
                    }`}
                  >
                    {isReady && <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>}
                    <PawPrint className={`w-6 h-6 ${isReady ? 'transform group-hover:rotate-12 transition-transform' : ''}`} />
                    {isReady ? "敲锤开庭 (Open Court)" : "请双方填写完毕 (Waiting...)"}
                  </button>
                </div>
              </>
            )}

            {/* Secret Input View: Show specific input if a side is active */}
            {activeSide === 'A' && (
              <SecretInput
                side="A"
                value={caseData.complaintA}
                onChange={(val) => setCaseData(prev => ({ ...prev, complaintA: val }))}
                onSave={() => setActiveSide(null)}
                onBack={() => setActiveSide(null)}
              />
            )}

            {activeSide === 'B' && (
              <SecretInput
                side="B"
                value={caseData.complaintB}
                onChange={(val) => setCaseData(prev => ({ ...prev, complaintB: val }))}
                onSave={() => setActiveSide(null)}
                onBack={() => setActiveSide(null)}
              />
            )}
          </>
        )}

        {courtState === CourtState.THINKING && (
          <div className="flex flex-col items-center justify-center h-64 animate-pop px-4 text-center">
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-full h-full bg-orange-100 rounded-full flex items-center justify-center border-4 border-orange-300">
                <span className="text-4xl animate-bounce">⚖️</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-amber-800">{loadingMsg}</h3>
          </div>
        )}

        {courtState === CourtState.VERDICT_READY && (
          <VerdictDisplay verdict={verdictText} onReset={handleReset} />
        )}

        {courtState === CourtState.ERROR && (
           <div className="flex flex-col items-center mt-12 p-8 bg-red-50 rounded-2xl border-2 border-red-200 mx-4">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-red-700 font-bold mb-4">法庭连接中断，请检查网络或 API Key</p>
              <button onClick={() => setCourtState(CourtState.IDLE)} className="text-sm underline text-red-500">
                返回
              </button>
           </div>
        )}
      </main>
      
      <footer className="text-center mt-12 pb-8 text-amber-800/40 text-sm font-medium">
        © 2024 Wangwang Court AI • Powered by Gemini
      </footer>
    </div>
  );
};

export default App;