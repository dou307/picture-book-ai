"use client";

import { useState } from 'react';
import { Loader2, Music, BookOpen, ChevronLeft, ChevronRight, Sparkles, Mic, Keyboard, Lock } from 'lucide-react';

// --- 1. 定义数据元组 (Tuples) ---
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

// --- 2. 抽离元件 (Components) ---
const ConfigBtn = ({ data, active, onClick, size = "normal" }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center transition-all duration-300 transform ${
      active ? 'scale-110 brightness-110' : 'grayscale-[0.2] opacity-90 hover:opacity-100 hover:scale-105'
    }`}
  >
    {/* 尺寸大幅增加：普通从 w-14 -> w-28，Large 从 w-20 -> w-36 */}
    <div className={`relative ${size === "large" ? "w-32 h-32 md:w-40 md:h-40" : "w-24 h-24 md:w-32 md:h-32"}`}>
      <img src={data.icon} alt={data.name} className="w-full h-full object-contain" />
      {active && (
        // 选中框也要跟着加粗
        <div className="absolute -inset-3 border-[6px] border-amber-400 rounded-3xl animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
      )}
    </div>
    {/* 文字调大到 text-xl，增加字间距 */}
    <span className="mt-4 text-sm md:text-xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-widest">
      {data.name}
    </span>
  </button>
);

export default function StoryBookApp() {
  // --- 状态管理 ---
  const [scene, setScene] = useState<'home' | 'config' | 'loading' | 'reading'>('home');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // --- 配置选项 ---
  const [inputMode, setInputMode] = useState('text');
  const [voice, setVoice] = useState('mom');
  const [style, setStyle] = useState('3d');
  const [prompt, setPrompt] = useState('');

  // --- 核心生成逻辑 ---
  const handleGenerate = async () => {
    if (!prompt) return alert("写下你的创意吧~");
    
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
        // 鲁棒性解析：处理百炼返回的字符串JSON
        if (finalData && typeof finalData.text === 'string') {
          const trimmed = finalData.text.trim();
          if (trimmed.startsWith('{')) {
            try { finalData = JSON.parse(trimmed); } catch (e) { finalData = { "1": trimmed }; }
          } else {
            finalData = { "1": trimmed };
          }
        }
        setResult(finalData);
        setScene('reading');
        setCurrentPage(1);
      } else {
        alert("魔法中断了: " + data.error);
        setScene('config');
      }
    } catch (error) {
      alert("网络连接失败");
      setScene('config');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = result ? Object.keys(result).filter(k => !isNaN(Number(k))).length : 0;

  return (
    <main className="relative w-full h-screen overflow-hidden bg-stone-900 select-none font-sans">
      
      {/* ---------------- 场景：首页 ---------------- */}
      {scene === 'home' && (
  <div className="relative w-full h-full">
    <img src="/images/bg-home.png" className="absolute inset-0 w-full h-full object-cover" />
    
    <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <button onClick={() => setScene('config')} className="relative group transition-transform hover:scale-110">
        {/* 麦克风从 w-48 -> w-80 (约320px) */}
        <img src="/images/micro.png" className="w-72 md:w-96 drop-shadow-2xl" />
        <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping -z-10" />
        
        {/* 气泡提示也要变大 */}
        <div className="absolute -top-24 -right-32 animate-bounce">
          <img src="/bubble_hint.png" className="w-56 md:w-64" />
        </div>
      </button>
    </div>

    {/* 左上角我的绘本图标 */}
    <button className="absolute top-12 left-12 hover:rotate-6 transition-transform">
      <img src="/icon_bookshelf.png" className="w-32 md:w-44" />
    </button>
  </div>
)}

      {/* ---------------- 场景：配置页 (我的秘密基地) ---------------- */}
{scene === 'config' && (
  <div className="relative w-full h-full">
    <img src="/images/bg-config.png" className="absolute inset-0 w-full h-full object-cover" />

    {/* 1. 输入模式：加宽间距 */}
    <div className="absolute top-[30%] left-[18%] flex gap-16 md:gap-24">
      {MODE_DATA.map(m => (
        <ConfigBtn key={m.id} data={m} active={inputMode === m.id} onClick={() => setInputMode(m.id)} />
      ))}
    </div>

    {/* 2. 音色选择：加宽间距 */}
    <div className="absolute top-[42%] right-[12%] flex gap-10 md:gap-14">
      {VOICE_DATA.map(v => (
        <ConfigBtn key={v.id} data={v} active={voice === v.id} onClick={() => setVoice(v.id)} />
      ))}
    </div>

    {/* 3. 绘本风格 (底部架子)：size="large" */}
    <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 flex gap-8 md:gap-12">
      {STYLE_DATA.map(s => (
        <ConfigBtn key={s.id} data={s} active={style === s.id} size="large" onClick={() => setStyle(s.id)} />
      ))}
    </div>

    {/* 家长锁：变大 */}
    <button className="absolute top-[38%] left-1/2 -translate-x-1/2 hover:scale-110 transition-transform">
      <img src="/images/lock.png" className="w-24 md:w-32" />
      <p className="text-white font-black text-center mt-2 drop-shadow-md">进入家长模式</p>
    </button>

    {/* 返回键：变大 */}
    <button onClick={() => setScene('home')} className="absolute top-10 left-10">
      <img src="/btn_back_home.png" className="w-24 md:w-28" />
    </button>
  </div>
)}

      {/* ---------------- 场景：生成中 ---------------- */}
      {scene === 'loading' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#2a1b0e]">
          <img src="/images/bg-config.png" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 flex flex-col items-center">
             <Loader2 className="w-24 h-24 text-amber-500 animate-spin mb-6" />
             <h2 className="text-3xl font-black text-white tracking-[0.5em] drop-shadow-lg">魔法绘画中...</h2>
             <p className="text-amber-200/60 mt-4 animate-pulse">正在为你的故事铺就色彩与旋律</p>
          </div>
        </div>
      )}

      {/* ---------------- 场景：阅读页 ---------------- */}
      {scene === 'reading' && result && (
        <div className="relative w-full h-full animate-in zoom-in duration-1000">
          <img src="/images/bg-reading.png" className="absolute inset-0 w-full h-full object-cover" />
          
          {/* 绘本主体 */}
          <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
            <div className="relative w-full max-w-6xl aspect-[1.5/1] bg-white/5 rounded-2xl flex shadow-2xl overflow-hidden border-[12px] border-white/10">
              
              {/* 左页：大图展示 */}
              <div className="flex-1 relative bg-stone-100 flex items-center justify-center p-4">
                <img 
                  src={result[currentPage]} 
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  key={currentPage} 
                />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/10 to-transparent" />
              </div>

              {/* 右页：文字与装饰 */}
              <div className="flex-1 bg-white p-8 md:p-16 flex flex-col items-center justify-center text-center relative">
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/10 to-transparent" />
                <Sparkles className="w-8 h-8 text-amber-400 mb-6 opacity-50" />
                <p className="text-2xl md:text-3xl font-medium text-stone-800 leading-relaxed italic">
                  {result[`text_${currentPage}`] || "正在聆听星空的故事..."}
                </p>
                
                {/* 独立音频控制 */}
                <div className="mt-12 w-full p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm">
                    <Music className="w-4 h-4" /> 故事配音
                  </div>
                  <audio key={`audio-${currentPage}`} controls src={result[`audio_${currentPage}`] || result.audio} className="w-full h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* 底部控制栏 */}
{/* 底部翻页控制 */}
<div className="absolute bottom-10 inset-x-0 px-20 flex justify-between items-center">
  <button 
    disabled={currentPage === 1} 
    onClick={() => setCurrentPage(p => p - 1)}
    className="group flex flex-col items-center gap-2 disabled:opacity-30"
  >
    {/* 尺寸从 w-16 -> w-28 */}
    <img src="/images/previous-page.png" className="w-24 md:w-32 group-hover:scale-110 transition-transform" />
    <span className="text-white font-black text-lg drop-shadow-md">上一页</span>
  </button>

  {/* 页码显示 */}
  <div className="px-12 py-4 bg-orange-900/60 backdrop-blur-xl border-4 border-white/20 rounded-full text-white font-black text-2xl">
    {currentPage} / {totalPages}
  </div>

  <button 
    disabled={currentPage >= totalPages} 
    onClick={() => setCurrentPage(p => p + 1)}
    className="group flex flex-col items-center gap-2 disabled:opacity-30"
  >
    <img src="/images/next-page.png" className="w-24 md:w-32 group-hover:scale-110 transition-transform" />
    <span className="text-white font-black text-lg drop-shadow-md">下一页</span>
  </button>
</div>

          {/* 返回配置 */}
          <button onClick={() => setScene('config')} className="absolute top-10 left-10">
            <img src="/btn_back.png" className="w-14 md:w-16 hover:scale-110 transition-transform" />
          </button>
        </div>
      )}
    </main>
  );
}

// 辅助函数：计算总页数 (如果是对象格式)
function getTotalPages(result: any) {
  if (!result) return 0;
  return Object.keys(result).filter(k => !isNaN(Number(k))).length;
}