import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Channel, ViewMode } from './types/iptv';
import { PLAYLIST_PRESETS, FALLBACK_CHANNELS } from './data/defaultPlaylists';
import { parseM3U, fetchPlaylistWithFallback } from './utils/m3uParser';
import { useHlsPlayer } from './hooks/useHlsPlayer';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VideoPlayer } from './components/VideoPlayer';
import { ChannelGrid } from './components/ChannelGrid';
import { PlaylistModal } from './components/PlaylistModal';
import { RemoteControlModal } from './components/RemoteControlModal';
import { ChannelNumberOverlay } from './components/ChannelNumberOverlay';

const DEFAULT_PLAYLIST_URL = PLAYLIST_PRESETS[0].url;

export default function App() {
  // Playlist & Channel State
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('ALL');
  const [currentPlaylistUrl, setCurrentPlaylistUrl] = useState<string>(DEFAULT_PLAYLIST_URL);
  const [currentPlaylistName, setCurrentPlaylistName] = useState<string>(PLAYLIST_PRESETS[0].name);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState<boolean>(true);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('bdix_view_mode') as ViewMode) || 'grid';
  });
  const [isTvMode, setIsTvMode] = useState<boolean>(() => {
    return localStorage.getItem('bdix_tv_mode') === 'true';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
  const [isRemoteModalOpen, setIsRemoteModalOpen] = useState<boolean>(false);

  // Favorites & Recents in LocalStorage
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('bdix_iptv_favs');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [recents, setRecents] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem('bdix_iptv_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // OSD Channel Number Dialing
  const [numberInputBuffer, setNumberInputBuffer] = useState<string>('');
  const numberTimerRef = useRef<NodeJS.Timeout | null>(null);

  // HLS Video Player Engine
  const {
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
    loadChannel,
    togglePlay,
    toggleMute,
    changeVolume,
    toggleFullscreen,
    togglePiP,
    cycleAspectRatio,
    retryCurrentChannel,
  } = useHlsPlayer();

  // Save viewMode & tvMode preferences
  useEffect(() => {
    localStorage.setItem('bdix_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('bdix_tv_mode', String(isTvMode));
  }, [isTvMode]);

  // Handle Channel Selection
  const handleSelectChannel = useCallback((channel: Channel) => {
    loadChannel(channel);
    
    // Add to recent history (avoid duplicates at head)
    setRecents((prev) => {
      const filtered = prev.filter(c => c.id !== channel.id);
      const updated = [channel, ...filtered].slice(0, 30);
      try {
        localStorage.setItem('bdix_iptv_recents', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save recents:', e);
      }
      return updated;
    });
  }, [loadChannel]);

  // Toggle Favorite
  const handleToggleFavorite = useCallback((channelId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(channelId)) {
        next.delete(channelId);
      } else {
        next.add(channelId);
      }
      try {
        localStorage.setItem('bdix_iptv_favs', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.warn('Failed to save favorites:', e);
      }
      return next;
    });
  }, []);

  // Load Playlist from text or URL
  const loadPlaylistFromContent = useCallback((content: string, playlistTitle: string = 'কাস্টম প্লেলিস্ট') => {
    setIsLoadingPlaylist(true);
    try {
      const parsed = parseM3U(content);
      if (parsed.channels.length > 0) {
        setChannels(parsed.channels);
        setCategories(parsed.categories);
        setCurrentPlaylistName(playlistTitle);
        setCurrentCategory('ALL');
        handleSelectChannel(parsed.channels[0]);
      } else {
        throw new Error('প্লেলিস্টে কোনো কার্যকর চ্যানেল পাওয়া যায়নি।');
      }
    } catch (err) {
      console.error('M3U parsing failed, loading fallback channels:', err);
      setChannels(FALLBACK_CHANNELS);
      setCategories(['সংবাদ (News)', 'খেলাধুলা (Sports)', 'আন্তর্জাতিক (International)', 'সাধারণ (General)', 'ডকুমেন্টারি (Documentary)']);
      setCurrentPlaylistName('BDIX লাইভ ব্যাকআপ প্যাক');
      handleSelectChannel(FALLBACK_CHANNELS[0]);
    } finally {
      setIsLoadingPlaylist(false);
    }
  }, [handleSelectChannel]);

  const loadPlaylistUrl = useCallback(async (url: string, name?: string) => {
    setIsLoadingPlaylist(true);
    setCurrentPlaylistUrl(url);
    if (name) setCurrentPlaylistName(name);

    try {
      const m3uText = await fetchPlaylistWithFallback(url);
      loadPlaylistFromContent(m3uText, name || 'BDIX Live Playlist');
    } catch (err) {
      console.warn('Error loading playlist URL, using fallback list:', err);
      // Fallback
      setChannels(FALLBACK_CHANNELS);
      setCategories(['সংবাদ (News)', 'খেলাধুলা (Sports)', 'আন্তর্জাতিক (International)', 'সাধারণ (General)', 'ডকুমেন্টারি (Documentary)']);
      setCurrentPlaylistName(name || 'BDIX লাইভ ব্যাকআপ প্যাক');
      handleSelectChannel(FALLBACK_CHANNELS[0]);
      setIsLoadingPlaylist(false);
    }
  }, [loadPlaylistFromContent, handleSelectChannel]);

  // Load Initial Playlist on Mount
  useEffect(() => {
    loadPlaylistUrl(DEFAULT_PLAYLIST_URL, PLAYLIST_PRESETS[0].name);
  }, []);

  // Filter Channels based on current category and search query
  const filteredChannels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    
    let baseList = channels;
    if (currentCategory === 'FAV') {
      baseList = channels.filter(ch => favorites.has(ch.id));
    } else if (currentCategory === 'RECENT') {
      baseList = recents;
    } else if (currentCategory !== 'ALL') {
      baseList = channels.filter(ch => ch.group === currentCategory);
    }

    if (!q) return baseList;

    return baseList.filter(ch => {
      const matchesTitle = ch.title.toLowerCase().includes(q);
      const matchesGroup = ch.group.toLowerCase().includes(q);
      const matchesNumber = String(ch.number).includes(q);
      return matchesTitle || matchesGroup || matchesNumber;
    });
  }, [channels, currentCategory, favorites, recents, searchQuery]);

  // Next and Previous Channel Logic
  const handleNextChannel = useCallback(() => {
    if (!filteredChannels.length) return;
    const currentIdx = filteredChannels.findIndex(c => c.id === currentChannel?.id);
    const nextIdx = (currentIdx + 1) % filteredChannels.length;
    handleSelectChannel(filteredChannels[nextIdx]);
  }, [filteredChannels, currentChannel, handleSelectChannel]);

  const handlePrevChannel = useCallback(() => {
    if (!filteredChannels.length) return;
    const currentIdx = filteredChannels.findIndex(c => c.id === currentChannel?.id);
    const prevIdx = (currentIdx - 1 + filteredChannels.length) % filteredChannels.length;
    handleSelectChannel(filteredChannels[prevIdx]);
  }, [filteredChannels, currentChannel, handleSelectChannel]);

  // Direct single stream player test
  const handlePlayDirectStream = useCallback((streamUrl: string, name: string = 'Direct Stream') => {
    const customCh: Channel = {
      id: 'custom_' + Date.now(),
      number: 999,
      title: name,
      group: 'কাস্টম স্ট্রিম (Direct)',
      logo: '',
      url: streamUrl,
      isCustom: true,
    };
    setChannels(prev => [customCh, ...prev]);
    handleSelectChannel(customCh);
  }, [handleSelectChannel]);

  // Number Key Pad OSD Dialing Handler
  const handleDigitPress = useCallback((digit: string) => {
    setNumberInputBuffer((prev) => {
      const next = prev + digit;

      if (numberTimerRef.current) clearTimeout(numberTimerRef.current);

      numberTimerRef.current = setTimeout(() => {
        const targetNum = parseInt(next, 10);
        if (!isNaN(targetNum)) {
          const match = channels.find(c => c.number === targetNum);
          if (match) {
            handleSelectChannel(match);
          }
        }
        setNumberInputBuffer('');
      }, 1500);

      return next;
    });
  }, [channels, handleSelectChannel]);

  // Smart TV D-Pad Spatial Navigation Helper
  const handleSpatialNavigation = (direction: 'up' | 'down' | 'left' | 'right') => {
    const focusables = Array.from(document.querySelectorAll<HTMLElement>('.tv-focusable')).filter(
      el => el.offsetWidth > 0 && el.offsetHeight > 0
    );

    if (!focusables.length) return;

    const activeEl = document.activeElement as HTMLElement;
    const currentIndex = focusables.indexOf(activeEl);

    if (currentIndex === -1) {
      focusables[0].focus();
      return;
    }

    const currentRect = activeEl.getBoundingClientRect();
    let bestCandidate: HTMLElement | null = null;
    let minDistance = Infinity;

    for (const el of focusables) {
      if (el === activeEl) continue;
      const rect = el.getBoundingClientRect();

      let isCandidate = false;
      if (direction === 'down' && rect.top >= currentRect.bottom - 12) isCandidate = true;
      if (direction === 'up' && rect.bottom <= currentRect.top + 12) isCandidate = true;
      if (direction === 'right' && rect.left >= currentRect.right - 12) isCandidate = true;
      if (direction === 'left' && rect.right <= currentRect.left + 12) isCandidate = true;

      if (isCandidate) {
        const dist = Math.hypot(
          (rect.left + rect.width / 2) - (currentRect.left + currentRect.width / 2),
          (rect.top + rect.height / 2) - (currentRect.top + currentRect.height / 2)
        );
        if (dist < minDistance) {
          minDistance = dist;
          bestCandidate = el;
        }
      }
    }

    if (bestCandidate) {
      (bestCandidate as HTMLElement).focus();
      (bestCandidate as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  };

  // Keyboard and Remote Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      const isInputActive = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

      // Digit keys for direct channel dialing (0-9)
      if (!isInputActive && e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigitPress(e.key);
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          if (!isInputActive) {
            e.preventDefault();
            handleSpatialNavigation('up');
          }
          break;
        case 'ArrowDown':
          if (!isInputActive) {
            e.preventDefault();
            handleSpatialNavigation('down');
          }
          break;
        case 'ArrowLeft':
          if (!isInputActive) {
            e.preventDefault();
            handleSpatialNavigation('left');
          }
          break;
        case 'ArrowRight':
          if (!isInputActive) {
            e.preventDefault();
            handleSpatialNavigation('right');
          }
          break;
        case 'PageDown':
        case 'ChannelDown':
          e.preventDefault();
          handleNextChannel();
          break;
        case 'PageUp':
        case 'ChannelUp':
          e.preventDefault();
          handlePrevChannel();
          break;
        case ' ':
          if (!isInputActive) {
            e.preventDefault();
            togglePlay();
          }
          break;
        case 'f':
        case 'F':
          if (!isInputActive) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case 'm':
        case 'M':
          if (!isInputActive) {
            e.preventDefault();
            toggleMute();
          }
          break;
        case 'Escape':
        case 'Backspace':
          if (isPlaylistModalOpen) {
            setIsPlaylistModalOpen(false);
          } else if (isRemoteModalOpen) {
            setIsRemoteModalOpen(false);
          } else if (isSidebarOpen) {
            setIsSidebarOpen(false);
          } else if (isFullscreen) {
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlaylistModalOpen, 
    isRemoteModalOpen, 
    isSidebarOpen, 
    isFullscreen, 
    handleNextChannel, 
    handlePrevChannel, 
    togglePlay, 
    toggleFullscreen, 
    toggleMute,
    handleDigitPress
  ]);

  // Volume adjustments via remote
  const handleVolumeUp = () => changeVolume(volume + 0.1);
  const handleVolumeDown = () => changeVolume(volume - 0.1);

  // Category title display helper
  const getCategoryTitle = () => {
    if (searchQuery) return `খোঁজার ফলাফল: "${searchQuery}"`;
    if (currentCategory === 'ALL') return 'সকল চ্যানেল';
    if (currentCategory === 'FAV') return 'প্রিয় চ্যানেলসমূহ';
    if (currentCategory === 'RECENT') return 'সম্প্রতি দেখা চ্যানেলসমূহ';
    return currentCategory;
  };

  return (
    <div className={`h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans ${isTvMode ? 'text-base' : 'text-sm'}`}>
      {/* On-screen Display Channel Number Overlay */}
      <ChannelNumberOverlay inputBuffer={numberInputBuffer} />

      {/* TOP BAR / HEADER */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenPlaylistModal={() => setIsPlaylistModalOpen(true)}
        onOpenRemoteModal={() => setIsRemoteModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isTvMode={isTvMode}
        setIsTvMode={setIsTvMode}
        currentPlaylistName={currentPlaylistName}
      />

      {/* MAIN CONTAINER: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR NAVIGATION */}
        <Sidebar
          categories={categories}
          currentCategory={currentCategory}
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            setSearchQuery('');
          }}
          totalChannels={channels.length}
          favoritesCount={favorites.size}
          recentsCount={recents.length}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          playlistName={currentPlaylistName}
        />

        {/* CONTENT AREA: PLAYER & CHANNELS */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
          {/* VIDEO PLAYER SECTION */}
          <VideoPlayer
            videoRef={videoRef}
            containerRef={containerRef}
            currentChannel={currentChannel}
            isPlaying={isPlaying}
            isBuffering={isBuffering}
            isMuted={isMuted}
            volume={volume}
            isFullscreen={isFullscreen}
            isPiP={isPiP}
            aspectRatio={aspectRatio}
            errorMessage={errorMessage}
            streamQuality={streamQuality}
            isFavorite={currentChannel ? favorites.has(currentChannel.id) : false}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onChangeVolume={changeVolume}
            onToggleFullscreen={toggleFullscreen}
            onTogglePiP={togglePiP}
            onCycleAspectRatio={cycleAspectRatio}
            onRetry={retryCurrentChannel}
            onPrevChannel={handlePrevChannel}
            onNextChannel={handleNextChannel}
            onToggleFavorite={() => {
              if (currentChannel) handleToggleFavorite(currentChannel.id);
            }}
            onOpenRemote={() => setIsRemoteModalOpen(true)}
            isTvMode={isTvMode}
          />

          {/* CHANNEL GRID / LIST */}
          <ChannelGrid
            channels={filteredChannels}
            currentChannel={currentChannel}
            favorites={favorites}
            viewMode={viewMode}
            setViewMode={setViewMode}
            categoryTitle={getCategoryTitle()}
            onSelectChannel={handleSelectChannel}
            onToggleFavorite={handleToggleFavorite}
            onResetSearch={() => {
              setSearchQuery('');
              setCurrentCategory('ALL');
            }}
            isTvMode={isTvMode}
          />
        </main>
      </div>

      {/* MODAL 1: PLAYLIST CONFIGURATION & SOURCE SELECTOR */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        currentUrl={currentPlaylistUrl}
        onLoadUrl={loadPlaylistUrl}
        onLoadFileContent={loadPlaylistFromContent}
        onPlayDirectStream={handlePlayDirectStream}
        isLoading={isLoadingPlaylist}
      />

      {/* MODAL 2: SMART TV REMOTE CONTROLLER & SHORTCUT GUIDE */}
      <RemoteControlModal
        isOpen={isRemoteModalOpen}
        onClose={() => setIsRemoteModalOpen(false)}
        onNextChannel={handleNextChannel}
        onPrevChannel={handlePrevChannel}
        onTogglePlay={togglePlay}
        isPlaying={isPlaying}
        onVolumeUp={handleVolumeUp}
        onVolumeDown={handleVolumeDown}
        onToggleMute={toggleMute}
        onToggleFullscreen={toggleFullscreen}
        onNumberPress={handleDigitPress}
      />
    </div>
  );
}
