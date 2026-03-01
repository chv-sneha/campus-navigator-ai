import { useEffect, useRef, useState } from "react";
import { renderSorting } from "@/lib/sortingAnimation";
import { renderBinaryTrees } from "@/lib/binaryTreesAnimation";
import { renderGraphs } from "@/lib/graphsAnimation";
import { renderDP } from "@/lib/dpAnimation";
import { renderHashing } from "@/lib/hashingAnimation";
import { renderOSScheduling } from "@/lib/osSchedulingAnimation";
import { renderNormalization } from "@/lib/normalizationAnimation";
import { renderTCPIP } from "@/lib/tcpipAnimation";
import { renderOOP } from "@/lib/oopAnimation";
import { renderRecursion } from "@/lib/recursionAnimation";
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from "lucide-react";

interface AnimatedReelProps {
  topic: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onComplete: () => void;
  duration: number;
}

const animationMap: Record<string, (ctx: CanvasRenderingContext2D, progress: number, w: number, h: number) => void> = {
  "sorting": renderSorting,
  "binary trees": renderBinaryTrees,
  "graphs": renderGraphs,
  "dp": renderDP,
  "hashing": renderHashing,
  "os scheduling": renderOSScheduling,
  "normalization": renderNormalization,
  "tcp/ip": renderTCPIP,
  "oop concepts": renderOOP,
  "recursion": renderRecursion
};

export default function AnimatedReel({ topic, isPlaying, onPlayPause, onComplete, duration }: AnimatedReelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const animationRef = useRef<number>();
  const speedRef = useRef(1);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef(0);

  const progress = Math.min(currentTime / duration, 1);

  useEffect(() => {
    speedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const topicKey = topic.trim().toLowerCase();
    const renderer = animationMap[topicKey];

    const renderFrame = (prog: number) => {
      try {
        ctx.fillStyle = "#0f0f1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (renderer) {
          renderer(ctx, prog, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = "#9ca3af";
          ctx.font = "20px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Animation coming soon for this topic", canvas.width / 2, canvas.height / 2);
          ctx.textAlign = "left";
        }
      } catch (error) {
        console.error(`Error rendering ${topic}:`, error);
        ctx.fillStyle = "#ef4444";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Error rendering animation", canvas.width / 2, canvas.height / 2);
        ctx.textAlign = "left";
      }
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      if (isPlaying) {
        const elapsed = (timestamp - startTimeRef.current) * speedRef.current;
        const newTime = pausedTimeRef.current + elapsed;
        setCurrentTime(newTime);
        
        const prog = Math.min(newTime / duration, 1);
        renderFrame(prog);

        if (prog >= 1) {
          onComplete();
          return;
        }
        
        animationRef.current = requestAnimationFrame(animate);
      } else {
        pausedTimeRef.current = currentTime;
        startTimeRef.current = 0;
        const prog = Math.min(currentTime / duration, 1);
        renderFrame(prog);
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, topic, duration, currentTime, onComplete]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds * 1000));
    setCurrentTime(newTime);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={640} height={360} className="w-full rounded-lg" />
      
      <div className="mt-3 space-y-2">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress * 100}%, #374151 ${progress * 100}%, #374151 100%)`
          }}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => handleSkip(-10)} className="p-2 hover:bg-gray-800 rounded">
              <SkipBack className="w-4 h-4 text-white" />
            </button>
            <button onClick={onPlayPause} className="p-2 hover:bg-gray-800 rounded">
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
            </button>
            <button onClick={() => setCurrentTime(0)} className="p-2 hover:bg-gray-800 rounded">
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
            <button onClick={() => handleSkip(10)} className="p-2 hover:bg-gray-800 rounded">
              <SkipForward className="w-4 h-4 text-white" />
            </button>
            <span className="text-sm text-gray-400 ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {[0.5, 1, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 text-xs rounded ${playbackSpeed === speed ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"}`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
