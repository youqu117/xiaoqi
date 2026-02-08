
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Sparkles, Heart, Stars, RefreshCw, Quote, 
  Sun, Moon, Compass, Crown, Star, Gift, ChevronRight
} from 'lucide-react';

// Consolidating types to avoid resolution issues in pure ESM environments
export interface BlessingData {
  title: string;
  text: string;
  imageUrl: string;
  color: string;
}

export enum AppState {
  LOADING,
  REVEALING
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  duration: number;
  color: string;
}

const BLESSINGS: BlessingData[] = [
  {
    title: "光之子",
    text: "在群星闪耀的时刻，你是最特别的一颗。愿造物主的光辉永远护佑你的前程，让你的每一个愿望都能在繁星中得到回响。祝你生日快乐！",
    imageUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1200&auto=format&fit=crop",
    color: "from-yellow-400 via-amber-200 to-orange-500"
  },
  {
    title: "星辰旅者",
    text: "时光流转，你是宇宙最精妙的杰作。愿星辰指引你的方向，愿万物为你献上生日的礼赞，在未来的旅途中，快乐与神迹常伴左右。生日快乐！",
    imageUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1200&auto=format&fit=crop",
    color: "from-blue-400 via-indigo-300 to-purple-600"
  },
  {
    title: "生命奇迹",
    text: "你是这浩瀚苍穹中最温柔的一抹亮色。今日诸神共舞，庆祝你的诞生。愿你心中永远栖息着一只不灭的火鸟，带你飞向幸福的巅峰。生日快乐！",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop",
    color: "from-pink-400 via-fuchsia-300 to-rose-600"
  },
  {
    title: "命运宠儿",
    text: "当第一缕晨曦划破寂静，那是宇宙对你的深情告白。你是命运赠予这世界的最佳礼物。愿你永远拥有一颗纯真勇敢的心。祝你生日快乐！",
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1200&auto=format&fit=crop",
    color: "from-emerald-400 via-cyan-200 to-teal-600"
  }
];

const COLORS = ['#FFD700', '#FFFFFF', '#FF69B4', '#00BFFF', '#ADFF2F', '#F0ABFC'];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const crownRef = useRef<HTMLButtonElement>(null);

  const cycleBlessing = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % BLESSINGS.length);
      setIsVisible(true);
    }, 450);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState(AppState.REVEALING);
      setIsVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const triggerSparkles = () => {
    const rect = crownRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const newParticles: Particle[] = Array.from({ length: 32 }).map((_, i) => ({
      id: Math.random(),
      x: centerX,
      y: centerY,
      rotation: Math.random() * 360,
      size: Math.random() * 16 + 8,
      duration: Math.random() * 800 + 1200,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2500);
  };

  const current = BLESSINGS[currentIdx];

  if (appState === AppState.LOADING) {
    return (
      <div className="fixed inset-0 celestial-bg flex flex-col items-center justify-center p-6 text-center z-[200]">
        <div className="relative mb-10">
          <div className="w-24 h-24 border-[3px] border-yellow-500/10 border-t-yellow-400 rounded-full animate-spin"></div>
          <Stars className="absolute inset-0 m-auto w-10 h-10 text-yellow-400 animate-pulse" />
        </div>
        <p className="font-divine text-yellow-100 tracking-[0.5em] font-light animate-pulse uppercase text-sm">
          Awakening the Oracle
        </p>
        <p className="mt-2 text-white/40 text-[10px] tracking-[0.2em] uppercase font-light italic">Syncing with the cosmos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen celestial-bg flex flex-col items-center overflow-x-hidden relative py-8 px-4 md:px-8">
      
      {/* Hardware Accelerated Particle Layer */}
      <div className="fixed inset-0 pointer-events-none z-[100] will-change-transform">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute animate-particle-out"
            style={{
              left: p.x,
              top: p.y,
              '--tx': `${(Math.random() - 0.5) * 500}px`,
              '--ty': `${(Math.random() - 0.5) * 800 - 300}px`,
              '--tr': `${p.rotation + (Math.random() - 0.5) * 1080}deg`,
              duration: `${p.duration}ms`
            } as any}
          >
            <Star 
              size={p.size} 
              fill={p.color}
              className="drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]" 
              style={{ color: p.color }}
            />
          </div>
        ))}
      </div>

      {/* Ambiance Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[15%] left-[10%] w-[45vw] h-[45vw] bg-purple-600/10 blur-[160px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[45vw] h-[45vw] bg-blue-600/10 blur-[160px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center flex-grow">
        
        {/* Header Section */}
        <header className="mb-8 text-center animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-4">
            <Gift className="w-4 h-4 text-yellow-400 animate-bounce" />
            <span className="font-divine text-[11px] tracking-[0.4em] font-bold text-yellow-100 uppercase">
              Divine Revelation
            </span>
          </div>
          <h1 className="font-ornate text-3xl md:text-5xl font-black tracking-widest mb-3 text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] uppercase">
            Celestial Oracle
          </h1>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent mx-auto rounded-full"></div>
        </header>

        {/* Card Section */}
        <section className={`w-full transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'}`}>
          <div className="relative aspect-[4/5.5] md:aspect-[4/5] w-full rounded-[3rem] overflow-hidden shadow-[0_45px_90px_-25px_rgba(0,0,0,0.9)] border border-white/10 group bg-slate-900 will-change-transform">
            <img 
              src={current.imageUrl} 
              alt={current.title}
              className="w-full h-full object-cover transition-transform duration-[30s] group-hover:scale-110 opacity-75"
            />
            
            {/* Elegant Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
            
            {/* Interaction Button */}
            <div className="absolute top-8 left-8">
              <button 
                ref={crownRef}
                onClick={triggerSparkles}
                className="w-16 h-16 rounded-2xl glass flex items-center justify-center animate-float hover:bg-white/10 transition-all active:scale-90 group/crown shadow-2xl overflow-hidden"
              >
                <Crown className="w-8 h-8 text-yellow-400 group-hover/crown:scale-125 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
                <div className="absolute inset-0 bg-yellow-400/10 opacity-0 group-hover/crown:opacity-100 transition-opacity blur-xl"></div>
              </button>
            </div>

            <div className="absolute top-10 right-10">
              <span className="font-divine text-[9px] tracking-[0.5em] font-black text-white/40 uppercase">
                Divine Blessing
              </span>
            </div>

            {/* Blessing Text */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 pb-12">
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-white/30"></div>
                  <h2 className={`font-bold text-3xl md:text-5xl bg-gradient-to-r ${current.color} text-gradient tracking-widest drop-shadow-lg`}>
                    {current.title}
                  </h2>
                  <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-white/30"></div>
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-6 -left-6 w-12 h-12 text-white/5 rotate-180" />
                  <p className="text-lg md:text-2xl font-light leading-relaxed text-blue-50/90 italic tracking-wider text-center drop-shadow-md">
                    {current.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Controls */}
        <section className="mt-12 mb-16 w-full flex flex-col items-center gap-12">
          <button 
            onClick={cycleBlessing}
            className="group relative flex items-center gap-6 px-16 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <RefreshCw className="w-5 h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-1000" />
            <span className="text-base font-bold tracking-[0.6em] text-white uppercase drop-shadow-md">
              开启神启
            </span>
            <ChevronRight className="w-5 h-5 text-white/30 group-hover:translate-x-2 transition-transform" />
          </button>

          {/* Decorative Deck */}
          <div className="flex gap-14">
            {[Heart, Compass, Sun, Moon].map((Icon, idx) => (
              <div key={idx} className="group relative p-3 cursor-pointer transition-all hover:-translate-y-3 text-white/10 hover:text-yellow-400">
                <Icon className="w-7 h-7 transition-all duration-500 ease-out" strokeWidth={1.2} />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_12px_rgba(250,204,21,1)] blur-[0.5px]"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full text-center pb-12">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-8"></div>
          <p className="font-divine text-[9px] tracking-[0.8em] text-white/10 uppercase font-light">
            Ethereal Realm • Immortal Oracle v3.2
          </p>
        </footer>

      </div>

      {/* Floating Stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(35)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-20 shadow-[0_0_8px_white]"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 12 + 8}s ease-in-out infinite`,
              animationDelay: Math.random() * 10 + 's'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes particle-out {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(0);
            opacity: 1;
            filter: blur(0px) brightness(2);
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--tx), var(--ty), 0) rotate(var(--tr)) scale(1.6);
            opacity: 0;
            filter: blur(2px);
          }
        }
        .animate-particle-out {
          animation: particle-out var(--duration, 1500ms) cubic-bezier(0.1, 0.9, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .celestial-bg {
          background: radial-gradient(circle at 50% 50%, #0a0a20 0%, #050510 60%, #010105 100%);
        }
      `}</style>
    </div>
  );
};

export default App;
