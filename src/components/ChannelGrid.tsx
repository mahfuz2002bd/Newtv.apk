import React from 'react';
import { 
  LayoutGrid, 
  List, 
  Star, 
  Play, 
  Tv, 
  SearchX, 
  Radio, 
  Volume2 
} from 'lucide-react';
import { Channel, ViewMode } from '../types/iptv';

interface ChannelGridProps {
  channels: Channel[];
  currentChannel: Channel | null;
  favorites: Set<string>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  categoryTitle: string;
  onSelectChannel: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  onResetSearch?: () => void;
  isTvMode?: boolean;
}

export const ChannelGrid: React.FC<ChannelGridProps> = ({
  channels,
  currentChannel,
  favorites,
  viewMode,
  setViewMode,
  categoryTitle,
  onSelectChannel,
  onToggleFavorite,
  onResetSearch,
  isTvMode,
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 overflow-hidden">
      {/* SECTION HEADER BAR */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center space-x-2">
            <span>{categoryTitle}</span>
          </h3>
          <span className="px-2 py-0.5 text-[10px] sm:text-xs bg-slate-800 text-indigo-400 border border-slate-700/60 rounded-full font-bold">
            {channels.length} টি চ্যানেল
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 tv-focusable transition-colors ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="গ্রিড ভিউ"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">গ্রিড</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 tv-focusable transition-colors ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="লিস্ট ভিউ"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">লিস্ট</span>
          </button>
        </div>
      </div>

      {/* CHANNELS CONTAINER */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4" id="channelsScrollArea">
        {channels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
              <SearchX className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-base font-bold text-slate-300">কোন চ্যানেল পাওয়া যায়নি!</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              অন্য কোনো নাম বা ক্যাটাগরি দিয়ে সার্চ করে দেখুন।
            </p>
            {onResetSearch && (
              <button
                onClick={onResetSearch}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl tv-focusable transition-colors"
              >
                সকল চ্যানেল দেখুন
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className={`grid gap-2.5 sm:gap-3.5 ${
            isTvMode 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'
          }`}>
            {channels.map((ch, idx) => {
              const isPlaying = currentChannel?.id === ch.id;
              const isFav = favorites.has(ch.id);

              return (
                <div
                  key={ch.id}
                  data-channel-id={ch.id}
                  onClick={() => onSelectChannel(ch)}
                  className={`group relative rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-between cursor-pointer border transition-all tv-focusable ${
                    isPlaying
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-600/25 ring-2 ring-indigo-500/40'
                      : 'bg-slate-900/90 hover:bg-slate-850 hover:border-slate-700 border-slate-800/80 shadow-md'
                  } ${isTvMode ? 'min-h-[140px]' : 'min-h-[120px]'}`}
                  tabIndex={100 + idx}
                >
                  {/* Channel Number Badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded-md border border-slate-800">
                    #{ch.number}
                  </span>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(ch.id);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-lg transition-colors z-10 ${
                      isFav 
                        ? 'text-amber-400 bg-amber-950/60' 
                        : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800/80 opacity-0 group-hover:opacity-100'
                    }`}
                    title={isFav ? 'প্রিয় তালিকা থেকে সরান' : 'প্রিয় তালিকায় যোগ করুন'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                  </button>

                  {/* Channel Logo / Icon */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center my-2 p-1 relative">
                    {ch.logo ? (
                      <img
                        src={ch.logo}
                        alt={ch.title}
                        className="max-w-full max-h-full object-contain filter drop-shadow-md rounded"
                        loading="lazy"
                        onError={(e) => {
                          // Hide broken image and fallback to placeholder
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback avatar if logo fails or is empty */}
                    <div 
                      className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-400"
                      style={{ display: ch.logo ? 'none' : 'flex' }}
                    >
                      <Tv className="w-6 h-6 text-slate-500" />
                    </div>
                  </div>

                  {/* Channel Titles */}
                  <div className="w-full text-center">
                    <p className={`text-xs font-bold truncate leading-tight ${
                      isPlaying ? 'text-indigo-300 font-extrabold' : 'text-slate-200'
                    } ${isTvMode ? 'text-sm' : ''}`}>
                      {ch.title}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {ch.group}
                    </p>
                  </div>

                  {/* Playing Indicator Equalizer Bars */}
                  {isPlaying && (
                    <div className="absolute bottom-1 right-2 flex items-end space-x-0.5">
                      <span className="w-1 h-2 bg-indigo-500 rounded-full animate-bounce" />
                      <span className="w-1 h-3.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="flex flex-col space-y-1.5 sm:space-y-2">
            {channels.map((ch, idx) => {
              const isPlaying = currentChannel?.id === ch.id;
              const isFav = favorites.has(ch.id);

              return (
                <div
                  key={ch.id}
                  data-channel-id={ch.id}
                  onClick={() => onSelectChannel(ch)}
                  className={`group rounded-xl p-2.5 sm:p-3 flex items-center justify-between cursor-pointer border transition-all tv-focusable ${
                    isPlaying
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/90 hover:bg-slate-850 hover:border-slate-700 border-slate-800/80'
                  }`}
                  tabIndex={100 + idx}
                >
                  <div className="flex items-center space-x-3 truncate">
                    {/* Channel Number */}
                    <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 w-10 text-center shrink-0">
                      #{ch.number}
                    </span>

                    {/* Channel Logo */}
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      {ch.logo ? (
                        <img
                          src={ch.logo}
                          alt={ch.title}
                          className="max-w-full max-h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Tv className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    <div className="truncate">
                      <p className={`text-xs sm:text-sm font-bold truncate ${
                        isPlaying ? 'text-indigo-300' : 'text-slate-200'
                      }`}>
                        {ch.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {ch.group}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(ch.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        isFav 
                          ? 'text-amber-400 bg-amber-950/50' 
                          : 'text-slate-500 hover:text-amber-400'
                      }`}
                      title={isFav ? 'প্রিয় তালিকা থেকে সরান' : 'প্রিয় তালিকায় যোগ করুন'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>

                    <div className={`p-2 rounded-lg ${isPlaying ? 'text-indigo-400 bg-indigo-950' : 'text-slate-500 group-hover:text-white'}`}>
                      {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
