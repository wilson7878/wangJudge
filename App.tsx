import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { SecretInput } from './components/SecretInput';
import { VerdictDisplay } from './components/VerdictDisplay';
import { Lobby } from './components/Lobby';
import { RoomData, CourtState, ActiveSide } from './types';
import { getVerdict } from './services/geminiService';
import { LOADING_MESSAGES } from './constants';
import { PawPrint, AlertCircle, Copy, Share2 } from 'lucide-react';

// Firebase imports
import { db } from './firebase';
import { ref, onValue, set, update } from 'firebase/database';

const App: React.FC = () => {
  // Application State
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [activeSide, setActiveSide] = useState<ActiveSide>(null);
  const [loadingMsg, setLoadingMsg] = useState<string>(LOADING_MESSAGES[0]);

  // Loading animation rotation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (roomData?.courtState === CourtState.THINKING) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[i]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [roomData?.courtState]);

  // Firebase Synchronization
  useEffect(() => {
    if (!roomId) return;

    const roomRef = ref(db, `rooms/${roomId}`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoomData(data);
      } else {
        // Initialize new room if it doesn't exist
        const initialData: RoomData = {
          complaintA: '',
          complaintB: '',
          isSealedA: false,
          isSealedB: false,
          courtState: CourtState.IDLE,
          verdict: '',
          errorMessage: ''
        };
        set(roomRef, initialData)
          .catch(err => console.error("Firebase Set Error:", err)); // Catch init error
        setRoomData(initialData);
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
      alert("无法连接数据库，请检查网络或权限 (Permission Denied)");
    });

    return () => unsubscribe();
  }, [roomId]);

  // Actions
  const handleJoinRoom = (id: string) => {
    setRoomId(id);
  };

  const updateComplaint = (side: 'A' | 'B', text: string) => {
    if (!roomId) return;
    update(ref(db, `rooms/${roomId}`), {
      [side === 'A' ? 'complaintA' : 'complaintB']: text
    }).catch(err => console.error("Firebase Update Error:", err));
  };

  const toggleSeal = (side: 'A' | 'B') => {
    if (!roomId || !roomData) return;
    const isSealedKey = side === 'A' ? 'isSealedA' : 'isSealedB';
    const currentStatus = side === 'A' ? roomData.isSealedA : roomData.isSealedB;
    update(ref(db, `rooms/${roomId}`), {
      [isSealedKey]: !currentStatus
    });
    // If we are locking, we return to dashboard
    if (!currentStatus) {
      setActiveSide(null);
    }
  };

  const handleOpenCourt = async () => {
    if (!roomId || !roomData) return;
    
    // Set state to THINKING
    try {
      await update(ref(db, `rooms/${roomId}`), { 
        courtState: CourtState.THINKING,
        errorMessage: '' // Clear previous errors
      });
    } catch (e) {
      console.error("Failed to set state to THINKING:", e);
      return;
    }

    try {
      // Call Gemini API
      console.log("Starting verdict generation...");
      const result = await getVerdict({
        complaintA: roomData.complaintA,
        complaintB: roomData.complaintB
      });
      console.log("Verdict received!");
      
      // Update DB with Verdict
      await update(ref(db, `rooms/${roomId}`), {
        verdict: result,
        courtState: CourtState.VERDICT_READY
      });

    } catch (error: any) {
      console.error("🚨 COURT CRASHED:", error);
      update(ref(db, `rooms/${roomId}`), { 
        courtState: CourtState.ERROR,
        errorMessage: error.message || "Unknown Error" 
      });
    }
  };

  const handleReset = () => {
    if (!roomId) return;
    update(ref(db, `rooms/${roomId}`), {
      complaintA: '',
      complaintB: '',
      isSealedA: false,
      isSealedB: false,
      courtState: CourtState.IDLE,
      verdict: '',
      errorMessage: ''
    });
    setActiveSide(null);
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      alert(`房间号 ${roomId} 已复制!`);
    }
  };

  // Render Logic
  const renderContent = () => {
    if (!roomId) {
      return <Lobby onJoinRoom={handleJoinRoom} />;
    }

    if (!roomData) {
      return <div className="mt-20 text-center animate-pulse text-amber-800">连接法庭网络中... (Connecting...)</div>;
    }

    // Verdict View
    if (roomData.courtState === CourtState.VERDICT_READY) {
      return <VerdictDisplay verdict={roomData.verdict} onReset={handleReset} />;
    }

    // Thinking View
    if (roomData.courtState === CourtState.THINKING) {
       return (
          <div className="flex flex-col items-center justify-center h-64 animate-pop px-4 text-center mt-12">
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-full h-full bg-orange-100 rounded-full flex items-center justify-center border-4 border-orange-300">
                <span className="text-4xl animate-bounce">⚖️</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-amber-800">{loadingMsg}</h3>
          </div>
       );
    }

    // Secret Input View
    if (activeSide) {
      return (
        <SecretInput
          side={activeSide}
          value={activeSide === 'A' ? roomData.complaintA : roomData.complaintB}
          isSealed={activeSide === 'A' ? roomData.isSealedA : roomData.isSealedB}
          onChange={(val) => updateComplaint(activeSide, val)}
          onToggleSeal={() => toggleSeal(activeSide)}
          onBack={() => setActiveSide(null)}
        />
      );
    }

    // Dashboard View
    const isReady = roomData.isSealedA && roomData.isSealedB;
    return (
      <>
        <div className="flex justify-center mb-6">
           <div 
             onClick={copyRoomId}
             className="bg-white/50 px-4 py-2 rounded-full flex items-center gap-2 text-amber-900/60 font-mono font-bold cursor-pointer hover:bg-white/80 transition-colors"
           >
             <span>Room ID: {roomId}</span>
             <Copy className="w-4 h-4" />
           </div>
        </div>

        <InputSection 
          roomData={roomData} 
          onSelectSide={setActiveSide} 
        />
        
        <div className="mt-12 mb-8 transition-all duration-500 flex justify-center">
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
            {isReady ? "敲锤开庭 (Open Court)" : "请双方提交证词 (Waiting...)"}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <Header />

      <main className="relative z-10 flex flex-col items-center w-full">
        {renderContent()}

        {roomData?.courtState === CourtState.ERROR && (
           <div className="flex flex-col items-center mt-12 p-8 bg-red-50 rounded-2xl border-2 border-red-200 mx-4 animate-pop">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-red-700 font-bold mb-4">
                {roomData.errorMessage || "法庭连接中断，请检查网络"}
              </p>
              <div className="text-xs text-red-400/80 mb-4 bg-red-100 p-2 rounded max-w-xs break-words text-center">
                 如果是配额问题，请稍后重试。
              </div>
              <button 
                onClick={() => update(ref(db, `rooms/${roomId}`), { courtState: CourtState.IDLE, errorMessage: '' })} 
                className="text-sm underline text-red-500 hover:text-red-700"
              >
                重试 (Retry)
              </button>
           </div>
        )}
      </main>
      
      <footer className="text-center mt-12 pb-8 text-amber-800/40 text-sm font-medium">
        © 2024 Wangwang Court AI • Multiplayer Enabled
      </footer>
    </div>
  );
};

export default App;