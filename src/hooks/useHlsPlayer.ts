import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { Channel, AspectRatioMode } from '../types/iptv';

export function useHlsPlayer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPiP, setIsPiP] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('contain');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [streamQuality, setStreamQuality] = useState<string>('Auto');

  // Clean up existing HLS instance
  const cleanupHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  // Play channel
  const loadChannel = useCallback((channel: Channel) => {
    setCurrentChannel(channel);
    setErrorMessage(null);
    setIsBuffering(true);

    const video = videoRef.current;
    if (!video) return;

    cleanupHls();

    const streamUrl = channel.url.trim();

    if (Hls.isSupported() && (streamUrl.includes('.m3u8') || streamUrl.includes('playlist') || !streamUrl.endsWith('.mp4'))) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        fragLoadingTimeOut: 20000,
        manifestLoadingTimeOut: 20000,
        levelLoadingTimeOut: 20000,
      });

      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsBuffering(false);
        setErrorMessage(null);
        if (data.levels && data.levels.length > 0) {
          const maxLevel = data.levels.reduce((prev, curr) => (curr.height > prev.height ? curr : prev), data.levels[0]);
          if (maxLevel && maxLevel.height) {
            setStreamQuality(`${maxLevel.height}p`);
          } else {
            setStreamQuality('HD Live');
          }
        } else {
          setStreamQuality('Live');
        }

        video.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn('Autoplay prevented or interrupted:', err);
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('Fatal HLS error encountered:', data.type, data.details);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMessage('নেটওয়ার্ক সমস্যা অথবা স্ট্রিম অফলাইন (Network/Offline)');
              setIsBuffering(false);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Trying to recover media error...');
              hls.recoverMediaError();
              break;
            default:
              setErrorMessage('স্ট্রিম চালু করা যায়নি (Stream unavailable)');
              setIsBuffering(false);
              cleanupHls();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') || streamUrl.endsWith('.mp4')) {
      // Safari / iOS Native HLS
      video.src = streamUrl;
      video.play().then(() => {
        setIsPlaying(true);
        setIsBuffering(false);
        setStreamQuality('Live');
      }).catch((err) => {
        console.warn('Native video play failed:', err);
        setErrorMessage('ভিডিও লোড করা যায়নি।');
        setIsBuffering(false);
      });
    } else {
      // Fallback direct assign
      video.src = streamUrl;
      video.play().then(() => {
        setIsPlaying(true);
        setIsBuffering(false);
      }).catch((e) => {
        console.warn('Fallback play error:', e);
        setErrorMessage('ব্রাউজারে এই ফরম্যাট সাপোর্ট করে না বা লিংক অফলাইন।');
        setIsBuffering(false);
      });
    }
  }, [cleanupHls]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const changeVolume = useCallback((val: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clamped = Math.max(0, Math.min(1, val));
    video.volume = clamped;
    video.muted = clamped === 0;
    setVolume(clamped);
    setIsMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn('Fullscreen error:', e);
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (e) {
      console.warn('PiP error:', e);
    }
  }, []);

  const cycleAspectRatio = useCallback(() => {
    setAspectRatio((prev) => {
      if (prev === 'contain') return 'cover';
      if (prev === 'cover') return 'fill';
      return 'contain';
    });
  }, []);

  const retryCurrentChannel = useCallback(() => {
    if (currentChannel) {
      loadChannel(currentChannel);
    }
  }, [currentChannel, loadChannel]);

  // Sync fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupHls();
    };
  }, [cleanupHls]);

  return {
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
    setIsBuffering,
    setIsPlaying,
  };
}
