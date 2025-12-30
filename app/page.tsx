"use client";

import { useState } from 'react';
import { Loader2, Music, Sparkles } from 'lucide-react';

// --- 1. 定义数据 (维持原图路径) ---
const MODE_DATA = [
  { id: 'text', name: '文字输入', icon: '/images/keyboard.png' },
  { id: 'voice', name: '语音输入', icon: '/images/mic-small.png' },
];

const VOICE_DATA = [
  { id: 'mom', name: '温柔妈妈音', icon: '/images/voice1.png' },
  { id: 'brother', name: '活泼哥哥音', icon: '/images/voice2.png' },
  { id: 'owl', name: '智慧爷爷音', icon: '/images/voice3.png' },
  { id: 'frog', name: '搞怪宝宝音', icon: '/images/voice4.png' },
];

const STYLE_DATA = [
  { id: '3d', name: '3D皮克斯', icon: '/images/type1.png' },
  { id: 'ghibli', name: '吉卜力', icon: '/images/type2.png' },
  { id: 'crayon', name: '蜡笔涂鸦', icon: '/images/type3.png' },
  { id: 'sticker', name: '贴纸风', icon: '/images/type4.png' },
  { id: 'lego', name: '积木风', icon: '/images/type5.png' },
];

// --- 2. 抽离元件 (维持大尺寸风格) ---
const ConfigBtn = ({ data, active, onClick, size = "normal" }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center transition-all duration-300 transform ${
      active ? 'scale-110 brightness-110' : 'grayscale-[0.2] opacity-90 hover:opacity-100 hover:scale-105'
    }`}
  >
    <div className={`relative ${size === "large" ? "w-32 h-32 md:w-40 md:h-40" : "w-24 h-24 md:w-32 md:h-32"}`}>
      <img src={data.icon} alt={data.name} className="w-full h-full object-contain" />
      {active && (
        <div className="absolute -inset-3 border-[6px] border-amber-400 rounded-3xl animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
      )}
    </div>
    <span className="mt-4 text-sm md:text-xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-widest">
      {data.name}
    </span>
  </button>
);

export default function StoryBookApp() {
  const [scene, setScene] = useState<'home' | 'config' | 'loading' | 'reading'>('home');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [inputMode, setInputMode] = useState('text'); // 默认文字，可由配置页修改
  const [voice, setVoice] = useState('mom');
  const [style, setStyle] = useState('3d');
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt && inputMode === 'text') return alert("写下你的创意吧~");
    
    setScene('loading');
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, voice, style, inputMode }),
      });
      const data = await response.json();
      if (response.ok) {
        let finalData = data.output;
        if (finalData && typeof finalData.text === 'string') {
          const trimmed = finalData.text.trim();
          if (trimmed.startsWith('{')) {
            try { finalData = JSON.parse(trimmed); } catch (e) { finalData = { "1": trimmed }; }
          } else { finalData = { "1": trimmed }; }
        }
        setResult(finalData);
        setScene('reading');
        setCurrentPage(1);
      } else {
        alert("魔法中断了: " + data.error);
        setScene('home');
      }
    } catch (error) {
      alert("网络连接失败");
      setScene('home');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = result ? Object.keys(result).filter(k => !isNaN(Number(k))).length : 0;

  return (
    <main className="relative w-full h-screen overflow-hidden bg-stone-900 select-none font-sans">
      
      {/* ---------------- 场景：首页 (集成输入逻辑) ---------------- */}
      {scene === 'home' && (
        <div className="relative w-full h-full animate-in fade-in duration-1000">
          <img src="/images/bg-home.png" className="absolute inset-0 w-full h-full object-cover" />
          
          {/* 中心区域：根据模式切换 */}
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
            {inputMode === 'voice' ? (
              // 语音模式：显示大麦克风
              <button 
                onClick={handleGenerate}
                className="relative group transition-transform hover:scale-110 active:scale-95"
              >
                <img src="/images/micro.png" className="w-72 md:w-96 drop-shadow-2xl" />
                <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping -z-10" />
                <div className="absolute -top-24 -right-32 animate-bounce">
                  <img src="/bubble_hint.png" className="w-56 md:w-64" />
                </div>
              </button>
            ) : (
              // 文字模式：显示大输入框
              <div className="flex flex-col items-center w-[70%] md:w-[50%] animate-in zoom-in-95">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-white/20 backdrop-blur-xl border-4 border-amber-900/20 rounded-[3rem] p-8 text-amber-950 font-black text-2xl outline-none shadow-2xl placeholder:text-amber-900/40 resize-none"
                  placeholder="在这里写下你的故事点子..."
                  rows={3}
                />
                <button 
                  onClick={handleGenerate}
                  className="mt-8 px-20 py-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-3xl rounded-full shadow-2xl transition-all active:scale-95 hover:scale-105"
                >
                  开始变魔法
                </button>
              </div>
            )}
          </div>

          {/* 左上角：我的书架 */}
          <button className="absolute top-12 left-12 hover:rotate-6 transition-transform">
            <img src="/icon_bookshelf.png" className="w-32 md:w-44" />
          </button>

          {/* 右上角：设置入口 (使用猫头鹰图标) */}
          <button 
            onClick={() => setScene('config')} 
            className="absolute top-12 right-12 group flex flex-col items-center"
          >
            <img src="/images/voice3.png" className="w-24 md:w-32 group-hover:rotate-12 transition-transform drop-shadow-lg" />
            <span className="mt-2 px-4 py-1 bg-black/40 text-white rounded-full font-bold text-sm backdrop-blur-sm">秘密基地</span>
          </button>
        </div>
      )}

      {/* ---------------- 场景：配置页 (纯设置中心) ---------------- */}
      {scene === 'config' && (
        <div className="relative w-full h-full animate-in slide-in-from-right duration-700">
          <img src="/images/bg-config.png" className="absolute inset-0 w-full h-full object-cover" />

          {/* 1. 输入模式选择区 */}
          <div className="absolute top-[30%] left-[18%] flex gap-16 md:gap-24">
            {MODE_DATA.map(m => (
              <ConfigBtn key={m.id} data={m} active={inputMode === m.id} onClick={() => setInputMode(m.id)} />
            ))}
          </div>

          {/* 2. 音色选择区 */}
          <div className="absolute top-[42%] right-[12%] flex gap-10 md:gap-14">
            {VOICE_DATA.map(v => (
              <ConfigBtn key={v.id} data={v} active={voice === v.id} onClick={() => setVoice(v.id)} />
            ))}
          </div>

          {/* 3. 绘本风格区 (底部木架) */}
          <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 flex gap-8 md:gap-12">
            {STYLE_DATA.map(s => (
              <ConfigBtn key={s.id} data={s} active={style === s.id} size="large" onClick={() => setStyle(s.id)} />
            ))}
          </div>

          {/* 家长锁 */}
          <button className="absolute top-[38%] left-1/2 -translate-x-1/2 hover:scale-110 transition-transform flex flex-col items-center">
            <img src="/images/lock.png" className="w-24 md:w-32" />
            <p className="text-white font-black mt-2 drop-shadow-md text-xl">家长模式</p>
          </button>

          {/* 返回首页按钮 */}
          <button onClick={() => setScene('home')} className="absolute top-10 left-10 hover:scale-110 transition-transform">
            <img src="/btn_back_home.png" className="w-24 md:w-28" />
          </button>
        </div>
      )}

      {/* ---------------- 场景：生成中 (维持原样) ---------------- */}
      {scene === 'loading' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#2a1b0e]">
          <img src="/images/bg-config.png" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 flex flex-col items-center">
             <Loader2 className="w-32 h-32 text-amber-500 animate-spin mb-8" />
             <h2 className="text-4xl font-black text-white tracking-[0.5em] drop-shadow-lg">魔法绘画中...</h2>
          </div>
        </div>
      )}

      {/* ---------------- 场景：阅读页 (维持大按钮风格) ---------------- */}
      {scene === 'reading' && result && (
        <div className="relative w-full h-full animate-in zoom-in duration-1000">
          <img src="/images/bg-reading.png" className="absolute inset-0 w-full h-full object-cover" />
          
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="relative w-full max-w-6xl aspect-[1.5/1] bg-white/5 rounded-2xl flex shadow-2xl overflow-hidden border-[12px] border-white/10">
              <div className="flex-1 relative bg-stone-100 flex items-center justify-center p-4">
                <img src={result[currentPage]} className="max-w-full max-h-full object-contain rounded" key={currentPage} />
              </div>
              <div className="flex-1 bg-white p-12 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-12 h-12 text-amber-400 mb-6" />
                <p className="text-3xl font-bold text-stone-800 leading-relaxed italic">
                  {result[`text_${currentPage}`] || "故事正在展开..."}
                </p>
                <div className="mt-12 w-full p-6 bg-amber-50 rounded-3xl border-2 border-amber-100">
                  <div className="flex items-center gap-2 mb-4 text-amber-800 font-black text-xl">
                    <Music className="w-6 h-6" /> 魔法配音
                  </div>
                  <audio key={`audio-${currentPage}`} controls src={result[`audio_${currentPage}`] || result.audio} className="w-full h-12" />
                </div>
              </div>
            </div>
          </div>

          {/* 翻页控制 */}
          <div className="absolute bottom-10 inset-x-0 px-20 flex justify-between items-center">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="group flex flex-col items-center gap-2 disabled:opacity-30">
              <img src="/images/previous-page.png" className="w-28 md:w-36 group-hover:scale-110 transition-all" />
              <span className="text-white font-black text-xl">上一页</span>
            </button>

            <div className="px-16 py-5 bg-orange-900/60 backdrop-blur-xl border-4 border-white/20 rounded-full text-white font-black text-3xl">
              {currentPage} / {totalPages}
            </div>

            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="group flex flex-col items-center gap-2 disabled:opacity-30">
              <img src="/images/next-page.png" className="w-28 md:w-36 group-hover:scale-110 transition-all" />
              <span className="text-white font-black text-xl">下一页</span>
            </button>
          </div>

          <button onClick={() => setScene('config')} className="absolute top-10 left-10">
            <img src="/btn_back.png" className="w-20 md:w-24 hover:scale-110 transition-transform" />
          </button>
        </div>
      )}
    </main>
  );
}