import React from 'react';
import { 
  Tv, 
  Star, 
  Layers, 
  History, 
  Radio, 
  X, 
  Sparkles, 
  Film, 
  Trophy, 
  Newspaper, 
  Music, 
  Smile, 
  Moon, 
  Globe 
} from 'lucide-react';
import { Channel } from '../types/iptv';

interface SidebarProps {
  categories: string[];
  currentCategory: string;
  onSelectCategory: (category: string) => void;
  totalChannels: number;
  favoritesCount: number;
  recentsCount: number;
  isOpen: boolean;
  onClose: () => void;
  playlistName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  currentCategory,
  onSelectCategory,
  totalChannels,
  favoritesCount,
  recentsCount,
  isOpen,
  onClose,
  playlistName,
}) => {
  // Helper to get an icon based on category name
  const getCategoryIcon = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('news') || lower.includes('নিউজ') || lower.includes('সংবাদ')) {
      return <Newspaper className="w-4 h-4 text-emerald-400" />;
    }
    if (lower.includes('sports') || lower.includes('খেলা') || lower.includes('cricket')) {
      return <Trophy className="w-4 h-4 text-amber-400" />;
    }
    if (lower.includes('movie') || lower.includes('cinema') || lower.includes('সিনেমা')) {
      return <Film className="w-4 h-4 text-rose-400" />;
    }
    if (lower.includes('music') || lower.includes('গান') || lower.includes('sangeet')) {
      return <Music className="w-4 h-4 text-purple-400" />;
    }
    if (lower.includes('kids') || lower.includes('cartoon') || lower.includes('কার্টুন')) {
      return <Smile className="w-4 h-4 text-sky-400" />;
    }
    if (lower.includes('islam') || lower.includes('quran') || lower.includes('ধর্মীয়')) {
      return <Moon className="w-4 h-4 text-teal-400" />;
    }
    if (lower.includes('international') || lower.includes('বিশ্ব') || lower.includes('world')) {
      return <Globe className="w-4 h-4 text-blue-400" />;
    }
    return <Tv className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 sm:w-72 bg-slate-900/98 md:bg-slate-900/90 border-r border-slate-800 z-40
        flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              ক্যাটাগরি সমূহ
            </span>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Navigation List */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* All Channels */}
          <button
            onClick={() => { onSelectCategory('ALL'); onClose(); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors tv-focusable ${
              currentCategory === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <span className="flex items-center space-x-2.5">
              <Radio className="w-4 h-4 text-indigo-300" />
              <span>সকল চ্যানেল</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              currentCategory === 'ALL' ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {totalChannels}
            </span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => { onSelectCategory('FAV'); onClose(); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors tv-focusable ${
              currentCategory === 'FAV'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <span className="flex items-center space-x-2.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>প্রিয় তালিকা</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              currentCategory === 'FAV' ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {favoritesCount}
            </span>
          </button>

          {/* Recent Watched */}
          <button
            onClick={() => { onSelectCategory('RECENT'); onClose(); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors tv-focusable ${
              currentCategory === 'RECENT'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <span className="flex items-center space-x-2.5">
              <History className="w-4 h-4 text-purple-400" />
              <span>সম্প্রতি দেখা</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              currentCategory === 'RECENT' ? 'bg-purple-700 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {recentsCount}
            </span>
          </button>

          <div className="pt-2 pb-1 px-2">
            <div className="h-px bg-slate-800" />
          </div>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isActive = currentCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { onSelectCategory(cat); onClose(); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors tv-focusable ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center space-x-2 truncate pr-1">
                  {getCategoryIcon(cat)}
                  <span className="truncate">{cat}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Stats */}
        <div className="p-3 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/60 flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">মোট চ্যানেল:</span>
            <span className="font-bold text-indigo-400 text-sm">{totalChannels}</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center text-[10px] text-slate-500 truncate max-w-[140px]">
              {playlistName}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
              BDIX OK
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
