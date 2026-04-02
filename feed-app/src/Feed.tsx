import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import type { YouTubeProps } from 'react-youtube';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react';

interface FeedProps {
  condition: 'A' | 'B';
}

interface VideoData {
  status: string;
  videoId: string;
  summary: string;
  bcaScore: number;
  url: string;
}

const VideoPlayer = ({ video, isActive }: { video: VideoData; isActive: boolean }) => {
  const [player, setPlayer] = useState<{playVideo: () => void; pauseVideo: () => void; getPlayerState: () => number} | null>(null);

  const [likesCount] = useState(() => Math.floor(Math.random() * 1000) + 100);
  const [commentsCount] = useState(() => Math.floor(Math.random() * 500) + 10);
  
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
      playlist: video.videoId, // Required for loop to work
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
    // Only set the player if the component is still mounted and isActive
    setPlayer(event.target);
    if (isActive) {
      // The playVideo call is sometimes failing if the iframe isn't fully ready in the DOM
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
    // Optionally: could handle skipping to next video automatically here
  };

  return (
    <div 
      className="relative w-full h-[100dvh] bg-black flex items-center justify-center snap-center snap-always overflow-hidden shrink-0"
      onClick={() => {
        if (player) {
          // Toggle play/pause on tap
          const state = player.getPlayerState();
          if (state === 1) { // Playing
            player.pauseVideo();
          } else {
            player.playVideo();
          }
        }
      }}
    >
      {/* Video Container - scaled up slightly to hide youtube branding sometimes visible at edges */}
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

      {/* Overlay UI - Right Side Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center gap-1">
          <div className="bg-black/20 p-3 rounded-full backdrop-blur-sm">
            <Heart className="w-8 h-8 text-white drop-shadow-lg" fill="white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow-md">
            {likesCount}K
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <div className="bg-black/20 p-3 rounded-full backdrop-blur-sm">
            <MessageCircle className="w-8 h-8 text-white drop-shadow-lg" fill="white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow-md">
            {commentsCount}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="bg-black/20 p-3 rounded-full backdrop-blur-sm">
            <Share2 className="w-8 h-8 text-white drop-shadow-lg" fill="white" />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow-md">Share</span>
        </div>
        
        <div className="mt-4 bg-black/40 p-2 rounded-full animate-spin-slow">
          <Music className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Overlay UI - Bottom Left Info */}
      <div className="absolute left-4 bottom-6 right-20 z-10">
        <h3 className="text-white font-bold text-lg mb-2 drop-shadow-md">
          @User{video.videoId.substring(0, 5)}
        </h3>
        <p className="text-white text-sm line-clamp-3 drop-shadow-md">
          {video.summary}
        </p>
      </div>

      {/* Gradient overlays to ensure text readability */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
    </div>
  );
};

export default function Feed({ condition }: FeedProps) {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCSV = async () => {
      const fileUrl = condition === 'A' ? '/e2w0.csv' : '/e0w2.csv';
      try {
        const response = await fetch(fileUrl);
        const csvText = await response.text();
        
        Papa.parse<string[]>(csvText, {
          complete: (result) => {
            // Remove empty lines
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
    
    // Use requestAnimationFrame to debounce scroll handling slightly and ensure accurate readings
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const { scrollTop, clientHeight } = containerRef.current;
      const index = Math.max(0, Math.min(videos.length - 1, Math.round(scrollTop / clientHeight)));
      
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col h-[100dvh] w-full overflow-hidden">
      {/* Finish Task Button */}
      <button 
        onClick={() => navigate('/end')}
        className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
      >
        Finish Task
      </button>

      {/* Main Feed Container */}
      <div 
        ref={containerRef}
        className="flex-1 h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar flex flex-col"
        onScroll={handleScroll}
      >
        {videos.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="animate-pulse">Loading feed...</div>
          </div>
        ) : (
          videos.map((video, index) => {
            // Only render videos that are close to the active index to save memory/DOM nodes
            if (Math.abs(index - activeIndex) > 2) {
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
