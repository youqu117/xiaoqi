
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Sparkles, Heart, Stars, RefreshCw, Quote, 
  Sun, Moon, Compass, Crown, Star, Gift, ChevronRight
} from 'lucide-react';
import { AppState, BlessingData } from './types';

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
    text: "在群星闪耀的时刻，你是最特别的一颗。愿造物主的光辉永远护佑你的前程，让你的每一个愿望都能在繁星中得到回响。生日快乐！",
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
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4b477?q=80&w=1200&auto=format&fit=crop",
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
    }, 400);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState(AppState.REVEALING);
      setIsVisible(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const triggerSparkles = () => {
    const rect = crownRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const newParticles: Particle[] = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      rotation: Math.random() * 360,
      size: Math.random() * 18 + 8,
      duration: Math.random() * 1000 + 1200,
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
        <p className="mt-2 text-white/40 text-[10px] tracking-[0.2em] uppercase font-light">正在同步星际祝福</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen celestial-bg flex flex-col items-center overflow-x-hidden relative py-8 px-4 md:px-8">
      
      {/* Sparkle Particle Container */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute animate-particle-out"
            style={{
              left: p.x,
              top: p.y,
              '--tx': `${(Math.random() - 0.5) * 450}px`,
              '--ty': `${(Math.random() - 0.5) * 700 - 250}px`,
              '--tr': `${p.rotation + (Math.random() - 0.5) * 720}deg`,
              duration: `${p.duration}ms`
            } as any}
          >
            <Star 
              size={p.size} 
              fill={p.color}
              className="drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]" 
              style={{ color: p.color }}
            />
          </div>
        ))}
      </div>

      {/* Ambiance Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-purple-600/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-blue-600/10 blur-[150px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Main Content Scrollable Container */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center flex-grow">
        
        {/* Header Section */}
        <header className="mb-8 text-center animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-6">
            <Gift className="w-4 h-4 text-yellow-400 animate-bounce" />
            <span className="font-divine text-[11px] tracking-[0.4em] font-bold text-yellow-100 uppercase">
              Celestial Oracle
            </span>
          </div>
          <h1 className="font-divine text-4xl md:text-5xl font-black tracking-tight mb-3 text-white drop-shadow-md">
            神圣生日礼赞
          </h1>
          <div className="h-1 w-16 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto rounded-full"></div>
        </header>

        {/* Hero Card Section - Ensuring no overlap */}
        <section className={`w-full transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
          <div className="relative aspect-[4/5] w-full rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 group bg-slate-900">
            <img 
              src={current.imageUrl} 
              alt={current.title}
              className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110 opacity-80"
            />
            
            {/* Elegant Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
            
            {/* Functional Interactions */}
            <div className="absolute top-8 left-8">
              <button 
                ref={crownRef}
                onClick={triggerSparkles}
                className="w-16 h-16 rounded-3xl glass flex items-center justify-center animate-float hover:bg-white/10 transition-all active:scale-90 group/crown shadow-xl"
                aria-label="Activate Divine Blessing"
              >
                <Crown className="w-8 h-8 text-yellow-400 group-hover/crown:scale-125 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
              </button>
            </div>

            <div className="absolute top-8 right-8">
              <div className="glass px-4 py-1.5 rounded-full border border-white/10">
                <span className="font-divine text-[10px] tracking-[0.3em] font-black text-white/60">
                  EST. ETERNITY
                </span>
              </div>
            </div>

            {/* Content Bottom */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 pt-24">
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <h2 className={`font-divine text-4xl md:text-5xl font-black bg-gradient-to-r ${current.color} bg-clip-text text-transparent drop-shadow-sm`}>
                    {current.title}
                  </h2>
                  <Sparkles className="w-8 h-8 text-white/20 mb-2 animate-pulse" />
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-6 -left-4 w-10 h-10 text-white/5 rotate-180" />
                  <p className="text-xl md:text-2xl font-light leading-relaxed text-blue-50/90 italic tracking-wide drop-shadow-sm">
                    {current.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Controls Section */}
        <section className="mt-12 mb-16 w-full flex flex-col items-center gap-10">
          <button 
            onClick={cycleBlessing}
            className="group relative flex items-center gap-5 px-12 py-6 bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <RefreshCw className="w-6 h-6 text-yellow-400 group-hover:rotate-180 transition-transform duration-1000" />
            <span className="font-divine text-base font-bold tracking-[0.4em] text-white">
              Seek New Fortune
            </span>
            <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x