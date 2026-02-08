
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Heart, Stars, RefreshCw, Quote, 
  Sun, Moon, Compass, Crown, Star, Gift, ChevronRight
} from 'lucide-react';

interface BlessingData {
  title: string;
  text: string;
  imageUrl: string;
  color: string;
}

enum AppState {
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
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const triggerSparkles = () => {
    const rect = crownRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const newParticles: Particle[] = Array.from({ length: 24 }).map(() => ({
      id: Math.random(),
      x: centerX,
      y: centerY,
      rotation: Math.random() * 360,
      size: Math.random() * 14 + 6,
      duration: Math.random() * 800 + 1000,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2000);
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
          正在唤醒星辰...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen celestial-bg flex flex-col items-center overflow-x-hidden relative py-8 px-4 md:px-8">
      
      {/* 粒子层 */}
      <div className="fixed inset-0 pointer-events-none z-[100] will-change-transform">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute animate-particle-out"
            style={{
              left: p.x,
              top: p.y,
              '--tx': `${(Math.random() - 0.5) * 400}px`,
              '--ty': `${(Math.random() - 0.5) * 600 - 200}px`,
              '--tr': `${p.rotation + (Math.random() - 0.5) * 720}deg`,
              duration: `${p.duration}ms`
            } as any}
          >
            <Star 
              size={p.size} 
              fill={p.color}
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
              style={{ color: p.color }}
            />
          </div>
        ))}
      </div>

      {/* 氛围渲染 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-purple-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-blue-600/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      {/* 核心内容容器 */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center flex-grow">
        
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-4">
            <Gift className="w-4 h-4 text-yellow-400" />
            <span className="font-divine text-[10px] tracking-[0.4em] font-bold text-yellow-100 uppercase">
              Divine Blessing
            </span>
          </div>
          <h1 className="font-ornate text-3xl md:text-5xl font-black tracking-widest mb-3 text-white uppercase drop-shadow-xl">
            星辰启示录
          </h1>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent mx-auto"></div>
        </header>

        {/* 祝福卡片 */}
        <section className={`w-full transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          <div className="relative aspect-[4/5.5] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
            <img 
              src={current.imageUrl} 
              alt={current.title}
              className="w-full h-full object-cover opacity-80"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
            
            {/* 冠冕按钮 */}
            <div className="absolute top-8 left-8">
              <button 
                ref={crownRef}
                onClick={triggerSparkles}
                className="w-14 h-14 rounded-xl glass flex items-center justify-center animate-float hover:bg-white/10 transition-all active:scale-90"
              >
                <Crown className="w-7 h-7 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
              </button>
            </div>

            {/* 文字区域 */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 pb-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-grow bg-white/20"></div>
                  <h2 className={`font-bold text-3xl md:text-4xl bg-gradient-to-r ${current.color} text-gradient tracking-widest`}>
                    {current.title}
                  </h2>
                  <div className="h-[1px] flex-grow bg-white/20"></div>
                </div>
                
                <div className="relative px-2">
                  <Quote className="absolute -top-4 -left-4 w-10 h-10 text-white/5 rotate-180" />
                  <p className="text-lg md:text-xl font-light leading-relaxed text-blue-50/90 tracking-wide text-center drop-shadow-sm">
                    {current.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 交互按钮 */}
        <section className="mt-12 mb-16 w-full flex flex-col items-center gap-10">
          <button 
            onClick={cycleBlessing}
            className="group relative flex items-center gap-6 px-14 py-5 bg-white/5 border border-white/10 rounded-full transition-all hover:bg-white/10 active:scale-95 shadow-xl"
          >
            <RefreshCw className="w-5 h-5 text-yellow-400 group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-base font-bold tracking-[0.5em] text-white">
              开启神启
            </span>
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex gap-12 text-white/10">
            {[Heart, Compass, Sun, Moon].map((Icon, idx) => (
              <Icon key={idx} className="w-6 h-6 hover:text-yellow-400/40 transition-colors cursor-pointer" strokeWidth={1} />
            ))}
          </div>
        </section>

        <footer className="w-full text-center pb-8">
          <p className="font-divine text-[9px] tracking-[0.6em] text-white/10 uppercase">
            Eternal Plane • Oracle v3.2
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes particle-out {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--tx), var(--ty), 0) rotate(var(--tr)) scale(1.5);
            opacity: 0;
          }
        }
        .animate-particle-out {
          animation: particle-out var(--duration, 1500ms) cubic-bezier(0.1, 0.9, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
