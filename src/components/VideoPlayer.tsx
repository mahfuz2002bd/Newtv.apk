import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  PictureInPicture, 
  RotateCw, 
  SkipBack, 
  SkipForward, 
  Star, 
  AlertTriangle, 
  Tv, 
  RectangleHorizontal,
  Radio,
  Sliders,
  List
} from 'lucide-react';
import { Channel, AspectRatioMode } from '../types/iptv';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  currentChannel: Channel | null;
  isPlaying: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  isPiP: boolean;
  aspectRatio: AspectRatioMode;
  errorMessage: string | null;
  streamQuality: string;
  isFavorite: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onChangeVolume: (val: number) => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onCycleAspectRatio: () => void;
  onRetry: () => void;
  onPrevChannel: () => void;
  onNextChannel: () => void;
  onToggleFavorite: () => void;
  onOpenRemote: () => void;
  onToggleQuickChannelDrawer?: () => void;
  isTvMode?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoRef,
  containerRef,
  currentChannel,
  isPlaying,
  isBuffering,
  isMuted,
  volume,
  isFullscreen,
  isPiP,
  aspectRatio,
  errorMessage,
  streamQuality,
  isFavorite,
  onTogglePlay,
  onToggleMute,
  onChangeVolume,
  onToggleFullscreen,
  onTogglePiP,
  onCycleAspectRatio,
  onRetry,
  onPrevChannel,
  onNextChannel,
  onToggleFavorite,
  onOpenRemote,
  onToggleQuickChannelDrawer,
  isTvMode,
}) => {
  const [showControls, setShowControls] = useState<boolean>(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto hide controls after 4 seconds of inactivity
  const handleUserActivity = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !errorMessage) {
        setShowControls(false);
      }
    }, 4000);
  };

  useEffect(() => {
    handleUserActivity();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isPlaying, currentChannel, errorMessage]);

  // Object fit class depending on aspect ratio state
  const getObjectFitClass = () => {
    switch (aspectRatio) {
      case 'cover':
        return 'object-cover';
      case 'fill':
        return 'object-fill';
      case 'contain':
      default:
        return 'object-contain';
    }
  };

  const getAspectLabel = () => {
    switch (aspectRatio) {
      case 'cover': return 'Zoom';
      case 'fill': return 'Stretch';
      case 'contain':
      default: return '16:9 Fit';
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      className={`relative bg-black w-full flex-shrink-0 border-b border-slate-800 shadow-2xl transition-all duration-300 group overflow-hidden select-none ${
        isFullscreen 
          ? 'h-screen w-screen fixed inset-0 z-50' 
          : isTvMode 
            ? 'h-[48vh] min-h-[300px] max-h-[640px]' 
            : 'h-[40vh] sm:h-[45vh] min-h-[220px] max-h-[580px]'
      }`}
    >
      {/* HTML Video Element */}
      <video
        ref={videoRef}
        className={`w-full h-full ${getObjectFitClass()} bg-black cursor-pointer`}
        playsInline
        crossOrigin="anonymous"
        onClick={onTogglePlay}
      />

      {/* Ambient Glow in background */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-transparent to-black/40" />

      {/* OVERLAY CONTROLS */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/70 flex flex-col justify-between p-3 sm:p-5 transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* TOP INFO BAR */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-3 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80 max-w-[80%]">
            {currentChannel?.logo ? (
              <img 
                src={currentChannel.logo} 
                alt={currentChannel.title}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded bg-slate-900 border border-slate-700/80 p-0.5 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-300 shrink-0">
                <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                {currentChannel && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600/80 text-white shrink-0">
                    CH {currentChannel.number}
                  </span>
                )}
                <h2 className="text-sm sm:text-base font-bold text-white drop-shadow truncate">
                  {currentChannel?.title || 'চ্যানেল নির্বাচন করুন'}
                </h2>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <span className="truncate">{currentChannel?.group || 'BDIX Live TV'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{streamQuality}</span>
              </div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 pointer-events-auto">
            {onToggleQuickChannelDrawer && isFullscreen && (
              <button
                onClick={onToggleQuickChannelDrawer}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white tv-focusable"
                title="চ্যানেল তালিকা (Channel List)"
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              </button>
            )}

            <button
              onClick={onToggleFavorite}
              className={`p-2 sm:p-2.5 rounded-xl border tv-focusable transition-colors ${
                isFavorite 
                  ? 'bg-amber-950/80 border-amber-600 text-amber-400 shadow-md shadow-amber-600/20' 
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-amber-400'
              }`}
              title={isFavorite ? 'প্রিয় তালিকা থেকে সরান' : 'প্রিয় তালিকায় যোগ করুন'}
            >
              <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* CENTER STATE (Buffering Spinner / Error Box) */}
        <div className="self-center flex flex-col items-center justify-center pointer-events-auto">
          {isBuffering && !errorMessage && (
            <div className="flex flex-col items-center space-y-2 bg-slate-950/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-800 shadow-xl">
              <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-300">বাফারিং হচ্ছে...</span>
            </div>
          )}

          {errorMessage && (
            <div className="text-center bg-red-950/90 border border-red-700/80 p-4 sm:p-5 rounded-2xl max-w-sm sm:max-w-md shadow-2xl backdrop-blur-md">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-red-100 mb-1">স্ট্রিম প্লে করা যাচ্ছে না</h3>
              <p className="text-xs text-red-300 mb-4">{errorMessage}</p>
              
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-red-600/30 tv-focusable transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>পুনরায় চেষ্টা করুন</span>
                </button>
                <button
                  onClick={onNextChannel}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 tv-focusable transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>পরবর্তী চ্যানেল</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS BAR */}
        <div className="flex items-center justify-between pointer-events-auto bg-slate-950/85 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-slate-800 shadow-2xl">
          {/* Left Controls: Play, Prev, Next, Volume */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              className="p-2 sm:p-2.5 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 tv-focusable transition-transform active:scale-95"
              title={isPlaying ? 'পজ (Space)' : 'চালান (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />}
            </button>

            {/* Prev Channel */}
            <button
              onClick={onPrevChannel}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl tv-focusable transition-colors"
              title="পূর্ববর্তী চ্যানেল (PageUp)"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Next Channel */}
            <button
              onClick={onNextChannel}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl tv-focusable transition-colors"
              title="পরবর্তী চ্যানেল (PageDown)"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center space-x-1.5 pl-1 sm:pl-2">
              <button
                onClick={onToggleMute}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl tv-focusable transition-colors"
                title={isMuted ? 'আনমিউট' : 'মিউট'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-14 sm:w-24 accent-indigo-500 cursor-pointer hidden sm:block tv-focusable"
                title="ভলিউম"
              />
            </div>
          </div>

          {/* Right Controls: Aspect Ratio, Quality, PiP, Fullscreen */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Aspect Ratio Switcher */}
            <button
              onClick={onCycleAspectRatio}
              className="px-2 py-1.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl tv-focusable transition-colors flex items-center space-x-1"
              title="ডিসপ্লে রেশিও পরিবর্তন (Fit / Zoom / Stretch)"
            >
              <RectangleHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{getAspectLabel()}</span>
            </button>

            {/* Quality badge */}
            <span className="hidden md:inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-900 border border-slate-800 text-indigo-400">
              {streamQuality}
            </span>

            {/* Picture in Picture */}
            <button
              onClick={onTogglePiP}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl tv-focusable transition-colors hidden sm:block"
              title="পিকচার-ইন-পিকচার (PiP)"
            >
              <PictureInPicture className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={onToggleFullscreen}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl tv-focusable transition-colors"
              title={isFullscreen ? 'ফুলস্ক্রিন থেকে বের হোন' : 'ফুলস্ক্রিন (F)'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              ) : (
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
