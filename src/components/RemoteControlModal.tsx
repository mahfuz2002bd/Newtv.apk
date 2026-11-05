import React from 'react';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1,
  Maximize2, 
  RotateCcw,
  Tv, 
  CornerDownLeft, 
  Keyboard, 
  Hash,
  Power
} from 'lucide-react';

interface RemoteControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNextChannel: () => void;
  onPrevChannel: () => void;
  onTogglePlay: () => void;
  isPlaying: boolean;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onSelectCurrentFocus?: () => void;
  onNumberPress: (digit: string) => void;
}

export const RemoteControlModal: React.FC<RemoteControlModalProps> = ({
  isOpen,
  onClose,
  onNextChannel,
  onPrevChannel,
  onTogglePlay,
  isPlaying,
  onVolumeUp,
  onVolumeDown,
  onToggleMute,
  onToggleFullscreen,
  onSelectCurrentFocus,
  onNumberPress,
}) => {
  if (!isOpen) return null;

  const simulateArrow = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: direction, bubbles: true }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT COLUMN: VIRTUAL SMART TV REMOTE CONTROLLER */}
        <div className="p-5 bg-slate-950 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-800 w-full md:w-72 shrink-0">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Tv className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                BDIX TV Remote
              </span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
          </div>

          {/* Power / Mode / Fullscreen */}
          <div className="w-full flex items-center justify-around py-3">
            <button
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-400 flex items-center justify-center text-xs active:scale-95 transition-all"
              title="প্লে/পজ"
            >
              <Power className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleMute}
              className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center active:scale-95 transition-all"
              title="মিউট"
            >
              <VolumeX className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleFullscreen}
              className="w-10 h-10 rounded-full bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-400 flex items-center justify-center active:scale-95 transition-all"
              title="ফুলস্ক্রিন"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* D-PAD CIRCULAR CONTROLLER */}
          <div className="relative w-44 h-44 rounded-full bg-slate-900 border-2 border-slate-800 shadow-2xl flex items-center justify-center my-2">
            {/* UP */}
            <button
              onClick={() => simulateArrow('ArrowUp')}
              className="absolute top-1.5 w-12 h-10 rounded-t-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600/30 active:scale-95 transition-all"
              title="উপরে যান"
            >
              <ChevronUp className="w-6 h-6" />
            </button>

            {/* DOWN */}
            <button
              onClick={() => simulateArrow('ArrowDown')}
              className="absolute bottom-1.5 w-12 h-10 rounded-b-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600/30 active:scale-95 transition-all"
              title="নিচে যান"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            {/* LEFT */}
            <button
              onClick={() => simulateArrow('ArrowLeft')}
              className="absolute left-1.5 w-10 h-12 rounded-l-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600/30 active:scale-95 transition-all"
              title="বামে যান"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* RIGHT */}
            <button
              onClick={() => simulateArrow('ArrowRight')}
              className="absolute right-1.5 w-10 h-12 rounded-r-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600/30 active:scale-95 transition-all"
              title="ডানে যান"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* OK / ENTER CENTER BUTTON */}
            <button
              onClick={() => {
                if (onSelectCurrentFocus) onSelectCurrentFocus();
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-700 to-indigo-500 hover:from-indigo-600 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/40 flex items-center justify-center active:scale-90 transition-all border border-indigo-400"
              title="OK / সিলেক্ট করুন"
            >
              OK
            </button>
          </div>

          {/* VOL & CH ROCKERS */}
          <div className="w-full grid grid-cols-2 gap-3 py-2 text-xs font-bold">
            {/* VOL Rocker */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 flex flex-col items-center space-y-1">
              <button
                onClick={onVolumeUp}
                className="w-full py-2 hover:bg-slate-800 rounded-xl text-slate-200 active:scale-95 text-center"
              >
                VOL +
              </button>
              <span className="text-[10px] text-slate-500 uppercase">ভলিউম</span>
              <button
                onClick={onVolumeDown}
                className="w-full py-2 hover:bg-slate-800 rounded-xl text-slate-200 active:scale-95 text-center"
              >
                VOL -
              </button>
            </div>

            {/* CH Rocker */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 flex flex-col items-center space-y-1">
              <button
                onClick={onNextChannel}
                className="w-full py-2 hover:bg-slate-800 rounded-xl text-indigo-400 active:scale-95 text-center font-bold"
              >
                CH +
              </button>
              <span className="text-[10px] text-slate-500 uppercase">চ্যানেল</span>
              <button
                onClick={onPrevChannel}
                className="w-full py-2 hover:bg-slate-800 rounded-xl text-indigo-400 active:scale-95 text-center font-bold"
              >
                CH -
              </button>
            </div>
          </div>

          {/* NUMBER PAD 0-9 */}
          <div className="w-full pt-2">
            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => onNumberPress(digit)}
                  className="py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-slate-300 hover:text-white active:scale-90 transition-all font-mono"
                >
                  {digit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: KEYBOARD SHORTCUTS REFERENCE */}
        <div className="p-5 flex-1 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Keyboard className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-slate-100 text-sm">
                  স্মার্ট টিভি ও কিবোর্ড শর্টকাট গাইড
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2 mb-4">
              অ্যান্ড্রয়েড টিভি, ফায়ারটিভি অথবা কিবোর্ডের মাধ্যমে সরাসরি চ্যানেল পরিবর্তন ও নিয়ন্ত্রণ করুন:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  ↑ ↓ ← →
                </span>
                <span className="text-slate-300">চ্যানেল গ্রিড ও অপশনে নেভিগেট করুন</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Enter / OK
                </span>
                <span className="text-slate-300">চ্যানেল সিলেক্ট ও প্লে করুন</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  PageUp / PageDown
                </span>
                <span className="text-slate-300">পরবর্তী বা আগের চ্যানেল পরিবর্তন</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Spacebar
                </span>
                <span className="text-slate-300">ভিডিও প্লে / পজ টগল</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  F
                </span>
                <span className="text-slate-300">ফুলস্ক্রিন অন / অফ</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  M
                </span>
                <span className="text-slate-300">শব্দ নিঃশব্দ (Mute / Unmute)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  0 - 9 (Digit)
                </span>
                <span className="text-slate-300">সরাসরি চ্যানেল নম্বরে যান (যেমন #101)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  Esc / Backspace
                </span>
                <span className="text-slate-300">ফুলস্ক্রিন বা পপআপ বন্ধ করুন</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-colors"
            >
              বুঝেছি (Got It)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
