import React from 'react';
import { Hash } from 'lucide-react';

interface ChannelNumberOverlayProps {
  inputBuffer: string;
}

export const ChannelNumberOverlay: React.FC<ChannelNumberOverlayProps> = ({ inputBuffer }) => {
  if (!inputBuffer) return null;

  return (
    <div className="fixed top-20 right-8 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="bg-slate-950/95 border-2 border-indigo-500 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
          <Hash className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">
            চ্যানেল নম্বর
          </span>
          <span className="text-2xl font-black font-mono tracking-widest text-white">
            {inputBuffer}
          </span>
        </div>
      </div>
    </div>
  );
};
