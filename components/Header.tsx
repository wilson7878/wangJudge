import React from 'react';
import { Gavel } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center py-8 text-center animate-pop">
      <div className="relative mb-4">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white transform hover:rotate-12 transition-transform duration-300 cursor-pointer">
          <span className="text-5xl filter drop-shadow-sm">🐶</span>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
          <Gavel className="w-6 h-6 text-yellow-600" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-2 tracking-wide">
        汪汪法庭
      </h1>
      <p className="text-amber-700/70 font-medium text-sm md:text-base bg-amber-100/50 px-4 py-1 rounded-full">
        专断家务事，只判有缘人
      </p>
    </header>
  );
};