import React from 'react';
import { 
  Tv, 
  Search, 
  X, 
  ListFilter, 
  Gamepad2, 
  Maximize2, 
  Minimize2, 
  Sparkles,
  Menu,
  MonitorPlay
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenPlaylistModal: () => void;
  onOpenRemoteModal: () => void;
  onToggleSidebar: () => void;
  isTvMode: boolean;
  setIsTvMode: React.Dispatch<React.SetStateAction<boolean>>;
  currentPlaylistName: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenPlaylistModal,
  onOpenRemoteModal,
  onToggleSidebar,
  isTvMode,
  setIsTvMode,
  currentPlaylistName,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-30 shrink-0">
      {/* Brand & Mobile Menu */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg tv-focusable"
          title="মেনু"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base sm:text-lg font-bold leading-none bg-gradient-to-r from-indigo-300 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                BDIX IPTV
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">
              {currentPlaylistName}
            </p>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="চ্যানেল খুঁজুন (Search channels or number)..." 
            className="w-full bg-slate-950/80 border border-slate-700/80 text-xs sm:text-sm rounded-full pl-9 pr-8 py-1.5 sm:py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 tv-focusable transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* TV Mode Toggle */}
        <button
          onClick={() => setIsTvMode(prev => !prev)}
          className={`p-2 rounded-lg border text-xs flex items-center space-x-1.5 tv-focusable transition-all ${
            isTvMode 
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30' 
              : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
          title={isTvMode ? 'স্ট্যান্ডার্ড মোড' : 'স্মার্ট টিভি 10ft মোড (বড় ফন্ট ও কার্ড)'}
        >
          <MonitorPlay className="w-4 h-4 text-indigo-300" />
          <span className="hidden xl:inline font-medium">
            {isTvMode ? 'টিভি মোড চালু' : 'টিভি মোড'}
          </span>
        </button>

        {/* Playlist URL & Source Modal */}
        <button 
          onClick={onOpenPlaylistModal}
          className="p-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 text-xs flex items-center space-x-1.5 tv-focusable transition-colors"
          title="প্লেলিস্ট সেটিংস"
        >
          <ListFilter className="w-4 h-4 text-indigo-400" />
          <span className="hidden md:inline font-medium">প্লেলিস্ট</span>
        </button>

        {/* Virtual TV Remote Button */}
        <button 
          onClick={onOpenRemoteModal}
          className="p-2 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 hover:from-indigo-900 hover:to-purple-900 border border-indigo-700/60 rounded-lg text-indigo-300 text-xs flex items-center space-x-1.5 tv-focusable shadow-sm transition-colors"
          title="টিভি রিমোট গাইড ও কন্ট্রোলার"
        >
          <Gamepad2 className="w-4 h-4 text-pink-400" />
          <span className="hidden sm:inline font-medium">রিমোট</span>
        </button>
      </div>
    </header>
  );
};
