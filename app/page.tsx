"use client";

import { useState } from 'react';
import { Loader2, Music, Sparkles } from 'lucide-react';

// --- 1. 定义数据 (确保图片路径正确) ---
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

// --- 2. 配置按钮组件 ---
const ConfigIcon = ({ data, active, onClick, size = "md" }) => (
  <button 
    onClick={onClick}
    className="group flex flex-col items-center transition-transform hover:scale-110 active:scale-95"
  >
    <div className={`relative transition-all ${
      size === 'lg' 
        ? 'w-32 h-32 md:w-40 md:h-40' 
        : 'w-24 h-24 md:w-28 md:h-28'
    } mb-2`}>
      <img 
        src={data.icon} 
        alt={data.name} 
        className={`w-full h-full object-contain transition-all ${
          active ? 'brightness-110 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'grayscale-[0.3] opacity-80'
        }`} 
      />
      {active && (
        <div className="absolute -inset-3 border-4 border-amber-400 rounded-3xl animate-pulse" />
      )}
    </div>
    <span className={`text-sm md:text-base font-black text-white drop-shadow-md px-3 py-1 rounded-lg ${
      active ? 'bg-amber-600' : 'bg-black/30'
    }`}>
      {data.name}
    </span>
  </button>
);

export default function StoryBookApp() {
  // --- 3. 状态定义 ---
  const [scene, setScene] = useState<'home' | 'config' | 'loading' | 'reading'>('home');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [inputMode, setInputMode] = useState('voice'); 
  const [voice, setVoice] = useState('mom');
  const [style, setStyle] = useState('3d');
  const [prompt, setPrompt] = useState('');

  // 计算总页数逻辑 (从第一个代码移植)
 const totalPages = result ? Math.floor(Object.keys(result).filter(k => !isNaN(Number(k))).length / 2) : 0;
  const handleGenerate = async () => {
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
        // 这里的处理逻辑维持第一个代码的鲁棒性
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
        alert("魔法中断了");
        setScene('home');
      }
    } catch (error) {
      setScene('home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full h-screen bg-stone-900 flex items-center justify-center overflow-hidden font-sans select-none">
      
      {/* 核心比例容器：锁定 16:9 */}
      <div className="relative aspect-video h-full max-w-full overflow-hidden shadow-2xl bg-black">
        
        {/* --- 首页 --- */}
        {scene === 'home' && (
          <div className="absolute inset-0 animate-in fade-in duration-700">
            <img src="/images/bg-home.png" className="w-full h-full object-cover" />
            
            <div className="absolute top-[0%] left-[5%] w-32 md:w-44">
              <img src="/images/shelf.png" alt="书架" className="hover:rotate-3 transition-transform cursor-pointer" />
            </div>
            
            <div className="absolute top-[0%] left-1/2 -translate-x-1/2 w-[25%]">
              <img src="/images/title.png" alt="童心驿站" />
            </div>

            <button onClick={() => setScene('config')} className="absolute top-[0%] right-[5%] w-40 group flex flex-col items-center">
              <img src="/images/go-to-config.png" className="group-hover:rotate-12 transition-transform drop-shadow-lg" />
              <div className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full mt-1">设置入口</div>
            </button>

            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
              {inputMode === 'voice' ? (
                <button onClick={handleGenerate} className="relative group transition-transform hover:scale-105 active:scale-95">
                  <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                  <img src="/images/micro.png" className="w-64 md:w-80 relative z-10" />
                  <div className="absolute -top-16 -right-24 w-48 md:w-56 animate-bounce">
                    <img src="/bubble_hint.png" />
                  </div>
                </button>
              ) : (
                <div className="w-[60%] flex flex-col items-center gap-4">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="说点什么吧..."
                    className="w-full p-6 rounded-[2rem] bg-white/90 text-xl border-4 border-amber-200 outline-none"
                    rows={3}
                  />
                  <button onClick={handleGenerate} className="px-12 py-4 bg-orange-500 text-white rounded-full font-black text-2xl shadow-xl hover:bg-orange-600">
                    去变魔法
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 配置页 --- */}
        {scene === 'config' && (
          <div className="absolute inset-0 animate-in slide-in-from-bottom-10 duration-500">
            <img src="/images/bg-config.png" className="w-full h-full object-cover" />
            
            <button onClick={() => setScene('home')} className="absolute top-[0%] left-[5%] w-32 md:w-40 hover:scale-110 transition-transform">
              <img src="/images/back-to-home.png" alt="返回" />
            </button>

            <div className="absolute top-[18%] left-[18%] flex flex-col items-center">
              <h3 className="text-white font-bold mb-4 px-4 py-1 bg-amber-900/40 rounded-full text-xs backdrop-blur-sm">输入模式选择区</h3>
              <div className="flex gap-6 md:gap-10">
                {MODE_DATA.map(m => (
                  <ConfigIcon key={m.id} data={m} active={inputMode === m.id} onClick={() => setInputMode(m.id)} />
                ))}
              </div>
            </div>

            <div className="absolute top-[42%] right-[6%] flex flex-col items-center">
              <h3 className="text-white font-bold mb-4 px-4 py-1 bg-amber-900/40 rounded-full text-xs backdrop-blur-sm">朗读音色选择区</h3>
              <div className="flex flex-row gap-3 md:gap-5">
                {VOICE_DATA.map(v => (
                  <ConfigIcon key={v.id} data={v} active={voice === v.id} onClick={() => setVoice(v.id)} />
                ))}
              </div>
            </div>

            <div className="absolute bottom-[12%] left-[36%] -translate-x-1/2 flex flex-col items-center w-[80%]">
              <h3 className="text-white font-bold mb-6 px-6 py-1 bg-amber-900/40 rounded-full text-sm backdrop-blur-sm">绘本风格选择区</h3>
              <div className="flex justify-center gap-4 md:gap-8">
                {STYLE_DATA.map(s => (
                  <ConfigIcon key={s.id} data={s} active={style === s.id} onClick={() => setStyle(s.id)} size="lg" />
                ))}
              </div>
            </div>

            <div className="absolute top-[5%] left-[48%] -translate-x-1/2 flex flex-col items-center group cursor-pointer">
              <img src="/images/lock.png" className="w-86 md:w-64 group-hover:scale-110 transition-transform drop-shadow-2xl" />
              <span className="text-white font-black mt-4 drop-shadow-lg text-xl tracking-widest">进入家长模式</span>
            </div>
          </div>
        )}

        {/* --- 加载中 --- */}
        {scene === 'loading' && (
           <div className="absolute inset-0 bg-stone-900 flex flex-col items-center justify-center">
              <Loader2 className="w-20 h-20 text-amber-500 animate-spin mb-6" />
              <p className="text-2xl text-white font-black tracking-widest">正在绘制你的梦境...</p>
           </div>
        )}

        {/* --- 阅读页 (应用第一个代码的逻辑) --- */}
{scene === 'reading' && result && (
  <div className="absolute inset-0 animate-in zoom-in duration-1000">
    <img src="/images/bg-reading.png" className="absolute inset-0 w-full h-full object-cover" />
    
    <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
      {/* 给容器加一个 key，确保切换页面时整个绘本内容物理刷新，防止浏览器缓存旧图 */}
      <div 
        key={`page-container-${currentPage}`} 
        className="relative w-full max-w-5xl aspect-[1.6/1] bg-white/5 rounded-2xl flex shadow-2xl overflow-hidden border-[8px] border-white/10"
      >
        {/* 左侧：插图 */}
        <div className="flex-1 relative bg-stone-100 flex items-center justify-center p-4">
          {/* 修正点 1：显式将 currentPage 转为字符串，确保匹配 JSON 的 Key "1","2","3"... */}
          <img 
            src={result[String(currentPage)]} 
            className="max-w-full max-h-full object-contain rounded shadow-lg" 
            alt={`第 ${currentPage} 页插图`}
          />
        </div>

        {/* 右侧：内容 */}
        <div className="flex-1 bg-white p-8 md:p-12 flex flex-col items-center justify-center text-center">
          <Sparkles className="w-10 h-10 text-amber-400 mb-4" />
          <p className="text-xl md:text-2xl font-bold text-stone-800 leading-relaxed italic">
            {result[`text_${currentPage}`] || "精彩的故事正在耳边响起..."}
          </p>
          
          <div className="mt-8 w-full p-4 md:p-6 bg-amber-50 rounded-3xl border-2 border-amber-100">
            <div className="flex items-center gap-2 mb-3 text-amber-800 font-black text-lg">
              <Music className="w-5 h-5" /> 魔法配音
            </div>
            
            {/* 修正点 2：音频 Key 也显式计算并转为字符串 */}
            <audio 
              key={`audio-player-${currentPage}`} 
              controls 
              src={result[String(currentPage + totalPages)] || result.audio} 
              className="w-full h-10" 
              autoPlay
            />
          </div>
        </div>
      </div>
    </div>


            {/* 底部翻页控制 */}
            <div className="absolute bottom-6 inset-x-0 px-12 flex justify-between items-center">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="group flex flex-col items-center gap-1 disabled:opacity-30"
              >
                <img src="/images/previous-page.png" className="w-20 md:w-28 group-hover:scale-110 transition-all" />
                <span className="text-white font-black text-sm">上一页</span>
              </button>

              <div className="px-10 py-3 bg-orange-900/60 backdrop-blur-xl border-2 border-white/20 rounded-full text-white font-black text-xl">
                {currentPage} / {totalPages}
              </div>

              <button 
                disabled={currentPage >= totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="group flex flex-col items-center gap-1 disabled:opacity-30"
              >
                <img src="/images/next-page.png" className="w-20 md:w-28 group-hover:scale-110 transition-all" />
                <span className="text-white font-black text-sm">下一页</span>
              </button>
            </div>

            {/* 返回按钮 */}
            <button onClick={() => setScene('config')} className="absolute top-0 left-6">
              <img src="/images/back-to-home.png" className="w-32 md:w-32 hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}