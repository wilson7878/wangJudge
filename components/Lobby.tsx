import React, { useState } from 'react';
import { Users, Plus, ArrowRight } from 'lucide-react';

interface LobbyProps {
  onJoinRoom: (roomId: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onJoinRoom }) => {
  const [inputRoomId, setInputRoomId] = useState('');

  const handleCreate = () => {
    // Generate a random 6-digit room ID
    const newRoomId = Math.floor(100000 + Math.random() * 900000).toString();
    onJoinRoom(newRoomId);
  };

  const handleJoin = () => {
    if (inputRoomId.length === 6) {
      onJoinRoom(inputRoomId);
    } else {
      alert("请输入6位房间号 (Please enter a 6-digit Room ID)");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-8 animate-pop">
      <div className="clay-card p-8 bg-white/80 flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold text-amber-900">开始调解 (Start Session)</h2>
        
        <button 
          onClick={handleCreate}
          className="w-full clay-button bg-orange-400 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-orange-500"
        >
          <Plus className="w-6 h-6" />
          创建新房间 (New Room)
        </button>

        <div className="relative w-full flex items-center justify-center my-2">
          <div className="border-t border-amber-200 w-full absolute"></div>
          <span className="bg-white px-3 text-amber-800/50 text-sm font-bold relative z-10">OR</span>
        </div>

        <div className="w-full">
          <label className="text-amber-800/60 text-sm font-bold mb-2 block">加入房间 (Join Room)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value.replace(/\D/g, ''))}
              className="clay-input flex-1 p-3 rounded-xl text-center text-xl tracking-widest text-amber-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
            <button 
              onClick={handleJoin}
              className="clay-button bg-amber-100 text-amber-800 p-3 rounded-xl hover:bg-amber-200"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-amber-800/40 text-xs mt-4">
          <Users className="w-4 h-4" />
          <span>Real-time Sync Active</span>
        </div>
      </div>
    </div>
  );
};
