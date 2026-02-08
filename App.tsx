
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { AppState, BlessingData } from './types';
import { 
  Sparkles, Heart, Stars, Play, RefreshCw, Volume2, 
  Mic, MicOff, Send, Film, Image as ImageIcon, Loader2, AlertCircle 
} from 'lucide-react';
import { 
  decode, encode, decodeAudioData, editDivineVision, animateVision 
} from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [blessing, setBlessing] = useState<BlessingData>({
    text: "欢迎来到星辰殿堂。在这里，你的每一个思绪都能重塑宇宙。",
    imageUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2000&auto=format&fit=crop"
  });
  
  // States for new features
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');

  // Refs for Live API
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  // Initialize Audio Contexts
  const initAudio = () => {
    if (!audioContextOutRef.current) {
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (!audioContextInRef.current) {
      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    }
  };

  const handleVeoKey = async () => {
    // Check for paid key for Veo
    if (!(window as any).aistudio?.hasSelectedApiKey()) {
      await (window as any).aistudio?.openSelectKey();
    }
    return true;
  };

  // Live API Connection
  const toggleLiveConversation = async () => {
    if (isLiveActive) {
      sessionRef.current?.close();
      setIsLiveActive(false);
      return;
    }

    initAudio();
    setIsLiveActive(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
              setTranscription('');
            }
            
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const ctx = audioContextOutRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsLiveActive(false),
          onerror: () => setIsLiveActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
          systemInstruction: '你是一位神圣的造物主。你正在与一位寻找生日祝福的灵魂交谈。你的语气宏大、神圣、温柔。你可以通过声音和他们实时交流。',
          outputAudioTranscription: {},
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      setIsLiveActive(false);
    }
  };

  const handleEditVision = async () => {
    if (!editPrompt.trim() || !blessing.imageUrl) return;
    setIsProcessing('reshaping');
    try {
      const newImage = await editDivineVision(blessing.imageUrl, editPrompt);
      setBlessing(prev => ({ ...prev, imageUrl: newImage }));
      setEditPrompt('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleAnimateVision = async () => {
    if (!blessing.imageUrl) return;
    setIsProcessing('animating');
    try {
      await handleVeoKey();
      const video = await animateVision(blessing.imageUrl);
      setVideoUrl(video);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="min-h-screen celestial-bg flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans selection:bg-yellow-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-6xl z-10 flex flex-col gap-8 animate-in fade-in duration-1000">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter flex items-center gap-4">
              <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" />
              神圣启示录
            </h1>
            <p className="text-blue-200/60 mt-2 tracking-[0.2em] font-light">DIVINE REVELATION INTERFACE V2.5</p>
          </div>

          {/* Voice Chat Toggle */}
          <button 
            onClick={toggleLiveConversation}
            className={`flex items-center gap-4 px-8 py-4 rounded-2xl border-2 transition-all group ${isLiveActive ? 'bg-red-500/20 border-red-500 text-red-100' : 'bg-white/5 border-white/10 hover:border-yellow-500/50 text-white'}`}
          >
            {isLiveActive ? (
              <>
                <MicOff className="w-6 h-6 animate-pulse" />
                <span className="font-bold tracking-widest">断开神识</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-bold tracking-widest">开启神启对话</span>
              </>
            )}
          </button>
        </div>

        {/* Live Transcription Overlay */}
        {isLiveActive && transcription && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl text-center text-blue-100 italic animate-pulse">
            神之音："{transcription}"
          </div>
        )}

        {/* Main Interaction Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          
          {/* Visual Display */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
              {videoUrl ? (
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
              ) : (
                <img src={blessing.imageUrl} className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-105" alt="Vision" />
              )}
              
              {/* Processing Overlays */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-in fade-in">
                  <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
                  <p className="text-xl font-bold text-yellow-200 tracking-[0.5em] uppercase">
                    {isProcessing === 'reshaping' ? '正在重塑维度...' : '正在注入生命...'}
                  </p>
                </div>
              )}

              {/* Reset Control */}
              {videoUrl && (
                <button 
                  onClick={() => setVideoUrl(null)}
                  className="absolute top-6 left-6 p-4 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all"
                >
                  <ImageIcon className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] relative group overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-yellow-500/40 group-hover:w-full transition-all duration-700 opacity-10"></div>
               <p className="text-2xl md:text-3xl font-light italic text-blue-50 leading-relaxed tracking-wide text-center relative z-10">
                 "{blessing.text}"
               </p>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="space-y-6">
            
            {/* Reshape Vision Tool */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4">
              <div className="flex items-center gap-3 text-yellow-400">
                <Sparkles className="w-5 h-5" />
                <h2 className="font-bold tracking-widest uppercase text-sm">重塑神迹 (AI 图像编辑)</h2>
              </div>
              <textarea 
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="例如：'添加复古滤镜'、'在背景中加入极光'..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-blue-100 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none"
              />
              <button 
                onClick={handleEditVision}
                disabled={!editPrompt.trim() || !!isProcessing}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 rounded-2xl text-black font-black tracking-[0.3em] transition-all flex items-center justify-center gap-2"
              >
                {isProcessing === 'reshaping' ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                提交祈愿
              </button>
            </div>

            {/* Animate Tool */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 p-6 rounded-[2rem] space-y-4">
              <div className="flex items-center gap-3 text-blue-400">
                <Film className="w-5 h-5" />
                <h2 className="font-bold tracking-widest uppercase text-sm">万物有灵 (Veo 视频生成)</h2>
              </div>
              <p className="text-xs text-blue-200/50 leading-relaxed">
                利用 Veo 3.1 动力，将这一瞬的静止画面转化为永恒的动态奇迹。
              </p>
              <button 
                onClick={handleAnimateVision}
                disabled={!!isProcessing || !!videoUrl}
                className="w-full py-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 rounded-2xl text-white font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                {isProcessing === 'animating' ? <Loader2 className="animate-spin" /> : <Stars className="w-5 h-5 text-yellow-400" />}
                开启生命律动
              </button>
            </div>

            {/* Stats/Extras */}
            <div className="flex justify-center gap-4 py-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-colors group">
                <Heart className="w-8 h-8 text-red-500/40 group-hover:text-red-500 transition-colors" />
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-colors group">
                <Stars className="w-8 h-8 text-yellow-500/40 group-hover:text-yellow-500 transition-colors" />
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors group"
              >
                <RefreshCw className="w-8 h-8 text-blue-500/40 group-hover:text-blue-500 transition-colors group-hover:rotate-180 duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/20 uppercase tracking-[0.5em] font-light z-20">
        Powered by Gemini 2.5 Flash & Veo 3.1
      </div>

      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white shadow-[0_0_8px_white]"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.4 + 0.1,
              animation: `float ${Math.random() * 8 + 8}s ease-in-out infinite`,
              animationDelay: Math.random() * 10 + 's'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
