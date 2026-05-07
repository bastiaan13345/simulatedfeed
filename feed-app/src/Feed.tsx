import { useState, useEffect, useRef, useCallback } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import type { YouTubeProps } from 'react-youtube';
import { Heart, MessageCircle, Share2, Music, ChevronDown, X, Timer, ExternalLink } from 'lucide-react';

interface FeedProps {
  condition: 'A' | 'B';
  timerMinutes: number;
}

interface VideoData {
  status: string;
  videoId: string;
  summary: string;
  bcaScore: number;
  url: string;
}

const VideoPlayer = ({ video, isActive }: { video: VideoData; isActive: boolean }) => {
  const [player, setPlayer] = useState<{ playVideo: () => void; pauseVideo: () => void; getPlayerState: () => number } | null>(null);
  const [expanded, setExpanded] = useState(false);

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: isActive ? 1 : 0,
      controls: 0,
      rel: 0,
      showinfo: 0,
      mute: 0,
      loop: 1,
      playlist: video.videoId,
      modestbranding: 1,
      playsinline: 1,
      disablekb: 1,
      fs: 0,
    },
  };

  useEffect(() => {
    if (player && typeof player.playVideo === 'function') {
      try {
        if (isActive) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
      } catch (e) {
        console.error("Error toggling video state", e);
      }
    }
  }, [isActive, player]);

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    if (isActive) {
      setTimeout(() => {
        try {
          if (event.target && typeof event.target.playVideo === 'function') {
            event.target.playVideo();
          }
        } catch (e) {
          console.error("Error playing video on ready", e);
        }
      }, 100);
    }
  };

  const onError: YouTubeProps['onError'] = (event) => {
    console.error('YouTube player error', event);
  };

  const handleVideoTap = (e: React.MouseEvent) => {
    // Don't toggle play/pause if tapping on overlay UI elements
    const target = e.target as HTMLElement;
    if (target.closest('[data-overlay]')) return;

    if (player) {
      const state = player.getPlayerState();
      if (state === 1) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  return (
    <div
      className="relative w-full h-[100dvh] bg-black flex items-center justify-center snap-center snap-always overflow-hidden shrink-0"
      onClick={handleVideoTap}
    >
      {/* Video Container */}
      <div className="absolute inset-0 w-full h-full transform scale-105 pointer-events-none z-0">
        <YouTube
          videoId={video.videoId}
          opts={opts}
          onReady={onReady}
          onError={onError}
          className="w-full h-full pointer-events-none"
          iframeClassName="w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-[1]" />

      {/* Right Side Action Buttons */}
      <div data-overlay className="absolute right-4 bottom-32 flex flex-col items-center gap-5 z-10">
        <div className="flex flex-col items-center gap-1.5">
          <div className="glass w-12 h-12 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" style={{ strokeWidth: 1.5 }} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="glass w-12 h-12 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" style={{ strokeWidth: 1.5 }} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="glass w-12 h-12 rounded-full flex items-center justify-center">
            <Share2 className="w-5 h-5 text-white" style={{ strokeWidth: 1.5 }} />
          </div>
        </div>

        <div className="mt-2 animate-pulse-ring">
          <div className="glass w-10 h-10 rounded-full flex items-center justify-center">
            <Music className="w-4 h-4 text-white" style={{ strokeWidth: 1.5 }} />
          </div>
        </div>
      </div>

      {/* Bottom Text - Collapsed (Default) */}
      {!expanded && (
        <div
          data-overlay
          className="absolute left-4 bottom-16 right-20 z-10 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-username text-white drop-shadow-md">
              @User{video.videoId.substring(0, 5)}
            </h3>
            <ChevronDown className="w-2 h-2 text-white/40" />
          </div>
        </div>
      )}

      {/* Bottom Text - Expanded Panel */}
      {expanded && (
        <>
          {/* Backdrop to dismiss */}
          <div
            data-overlay
            className="absolute inset-0 z-20"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(false);
            }}
          />
          <div
            data-overlay
            className="absolute inset-x-0 bottom-0 z-30 animate-slide-up"
            style={{
              background: 'rgba(28, 28, 30, 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '20px 16px 32px',
            }}
          >
            {/* Drag indicator */}
            <div className="w-8 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.2)' }} />

            {/* Close button */}
            <button
              className="absolute top-4 right-4"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
            >
              <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
            </button>

            <h3 className="text-username text-white mb-3">
              @User{video.videoId.substring(0, 5)}
            </h3>
            <p className="text-summary" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {video.summary}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default function Feed({ condition, timerMinutes }: FeedProps) {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFinishBtn, setShowFinishBtn] = useState(true);
  const [finishBtnVisible, setFinishBtnVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(() => timerMinutes * 60);

  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-hide finish button after 3 seconds of no interaction
  const scheduleHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setFinishBtnVisible(false);
      // Wait for fade animation to complete before fully hiding
      setTimeout(() => setShowFinishBtn(false), 300);
    }, 3000);
  }, []);

  const resetHideTimer = useCallback(() => {
    setFinishBtnVisible(true);
    setShowFinishBtn(true);
    scheduleHideTimer();
  }, [scheduleHideTimer]);

  useEffect(() => {
    scheduleHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [scheduleHideTimer]);

  // Show button on any touch/click
  useEffect(() => {
    const handleInteraction = () => resetHideTimer();
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('click', handleInteraction);
    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, [resetHideTimer]);

  useEffect(() => {
    const fetchCSV = async () => {
      const fileUrl = condition === 'A' ? '/e2w0.csv' : '/e0w2.csv';
      try {
        const response = await fetch(fileUrl);
        const csvText = await response.text();

        Papa.parse<string[]>(csvText, {
          complete: (result) => {
            const dataRows = result.data.filter(row => row.length >= 5 && row[0] !== 'Status');

            const parsedData: VideoData[] = dataRows.map(row => ({
              status: row[0],
              videoId: row[1],
              summary: row[2],
              bcaScore: parseFloat(row[3]),
              url: row[4],
            }));

            setVideos(parsedData);
          },
          error: (error: Error) => {
            console.error("Error parsing CSV", error);
          }
        });
      } catch (error) {
        console.error("Error fetching CSV", error);
      }
    };

    fetchCSV();
  }, [condition]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const { scrollTop, clientHeight } = containerRef.current;
      const index = Math.max(0, Math.min(videos.length - 1, Math.round(scrollTop / clientHeight)));

      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    });
  };

  const showPopup = timeLeft === 0;

  return (
    <div className="fixed inset-0 bg-black flex flex-col h-[100dvh] w-full overflow-hidden">
      {/* Floating Finish Task Pill - auto-hides */}
      {showFinishBtn && (
        <button
          onClick={() => navigate('/end')}
          className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 glass px-5 py-2 rounded-full text-sm font-medium transition-opacity duration-300 ${finishBtnVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          Finish Task
        </button>
      )}

      {/* Bottom Timer */}
      {timeLeft > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 glass px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-none transition-all duration-300">
          <Timer className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[13px] font-medium tracking-tight" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      {/* Time's Up Popup */}
      {showPopup && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
          <div className="glass w-full max-w-sm rounded-[32px] p-8 flex flex-col items-center text-center animate-fade-scale-in">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Timer className="w-8 h-8 text-white/60" />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-2">Time's Up!</h2>
            <p className="text-white/40 mb-8 leading-relaxed">
              You've completed the allocated time for this part of the study. Please proceed to the STAI-Y1 survey.
            </p>

            <button
              onClick={() => navigate('/end')}
              className="w-full glass glass-hover hover-scale py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-medium transition-all"
            >
              Go to Survey
              <ExternalLink className="w-4 h-4 opacity-40" />
            </button>
          </div>
        </div>
      )}

      {/* Main Feed Container */}
      <div
        ref={containerRef}
        className="flex-1 h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar flex flex-col"
        onScroll={handleScroll}
      >
        {videos.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="animate-pulse" style={{ color: 'rgba(255,255,255,0.3)' }}>Loading feed...</div>
          </div>
        ) : (
          videos.map((video, index) => {
            if (index < activeIndex - 1 || index > activeIndex + 3) {
              return (
                <div key={`${video.videoId}-${index}`} className="w-full h-[100dvh] snap-center snap-always bg-black shrink-0" />
              );
            }
            return (
              <VideoPlayer
                key={`${video.videoId}-${index}`}
                video={video}
                isActive={index === activeIndex}
              />
            );
          })
        )}
      </div>
    </div>
  );
}