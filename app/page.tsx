"use client";

import { useState } from 'react';
import { 
  Loader2, Music, BookOpen, Send, Sparkles, 
  User, Baby, Mic, Keyboard, Dog, UserRound, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function Home() {
  // --- 状态管理 ---
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [inputType, setInputType] = useState<'text' | 'voice'>('text');
  const [role, setRole] = useState<'parent' | 'child'>('child');
  const [style, setStyle] = useState<'animal' | 'human'>('animal');
  const [currentPage, setCurrentPage] = useState(1);

  // --- 生成逻辑 ---
  const handleGenerate = async () => {
    if (!prompt) return alert("请输入内容");
    setLoading(true);
    setResult(null);
    setCurrentPage(1);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, role, style }),
      });

      const data = await response.json();

      if (response.ok) {
        let finalData = data.output;
        if (finalData && typeof finalData.text === 'string') {
          const trimmedText = finalData.text.trim();
          if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
            try {
              finalData = JSON.parse(trimmedText);
            } catch (e) {
              finalData = { "1": trimmedText };
            }
          } else {
            finalData = { "1": trimmedText };
          }
        }
        setResult(finalData); 
      } else {
        alert("生成出错：" + (data.error || "未知错误"));
      }
    } catch (error) {
      alert("网络错误，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = result ? Object.keys(result).filter(k => !isNaN(Number(k))).length : 0;

  return (
    /* 【位置 1】最外层容器，添加 relative 和 overflow-x-hidden */
    <div className="relative min-h-screen text-slate-800 overflow-x-hidden">
      
      {/* 【位置 2】背景图层：它会固定在屏幕最底层 */}
      <div className="fixed inset-0 -z-10">
        {/* 背景图 */}
        <img 
          src="/background.jpg" 
          alt="Background" 
          className="w-full h-full object-cover" 
        />
        {/* 蒙版：让背景变模糊一点，并带上一层淡淡的琥珀色，增加梦幻感 */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />
      </div>

      {/* 顶部装饰条 */}
      <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />

      {/* 【位置 3】主内容区：它会浮在背景图上方 */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white/80 backdrop-blur rounded-full mb-4 shadow-xl shadow-amber-200/20">
            <BookOpen className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 drop-shadow-md">AI 梦幻绘本馆</h1>
          <p className="text-xl text-slate-700 font-medium">在光影摇曳的树屋里，创作你的故事</p>
        </div>

        {/* 交互控制中心：稍微增加了透明度，让它更有高级感 */}
        <div className="bg-white/90 backdrop-blur-xl border-2 border-white rounded-[3rem] shadow-2xl p-6 md:p-10 mb-12 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 1. 角色选择 */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 text-center uppercase tracking-widest">阅读对象</label>
              <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setRole('child')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${role === 'child' ? 'bg-white shadow-lg text-amber-600 scale-105' : 'text-slate-500'}`}
                >
                  <Baby className="w-4 h-4" /> 宝贝
                </button>
                <button 
                  onClick={() => setRole('parent')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${role === 'parent' ? 'bg-white shadow-lg text-amber-600 scale-105' : 'text-slate-500'}`}
                >
                  <User className="w-4 h-4" /> 家长
                </button>
              </div>
            </div>

            {/* 2. 输入方式 */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 text-center uppercase tracking-widest">输入方式</label>
              <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setInputType('text')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${inputType === 'text' ? 'bg-white shadow-lg text-blue-600 scale-105' : 'text-slate-500'}`}
                >
                  <Keyboard className="w-4 h-4" /> 文字
                </button>
                <button 
                  onClick={() => setInputType('voice')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${inputType === 'voice' ? 'bg-white shadow-lg text-blue-600 scale-105' : 'text-slate-500'}`}
                >
                  <Mic className="w-4 h-4" /> 语音
                </button>
              </div>
            </div>

            {/* 3. 风格选择 */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 text-center uppercase tracking-widest">主角类型</label>
              <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setStyle('animal')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${style === 'animal' ? 'bg-white shadow-lg text-green-600 scale-105' : 'text-slate-500'}`}
                >
                  <Dog className="w-4 h-4" /> 动物
                </button>
                <button 
                  onClick={() => setStyle('human')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${style === 'human' ? 'bg-white shadow-lg text-green-600 scale-105' : 'text-slate-500'}`}
                >
                  <UserRound className="w-4 h-4" /> 人类
                </button>
              </div>
            </div>
          </div>

          {/* 输入区域 */}
          {inputType === 'text' ? (
            <textarea
              className="w-full text-lg p-6 bg-white/50 border-2 border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-amber-200 focus:bg-white outline-none min-h-[120px] resize-none text-slate-700 transition-all shadow-inner"
              placeholder={`在这里写下你想告诉宝贝的故事创意...`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          ) : (
            <div className="w-full min-h-[120px] flex flex-col items-center justify-center bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-white mb-3 shadow-xl shadow-amber-200">
                <Mic className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-medium">点击开启语音魔法</p>
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-8 py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-[2rem] font-black text-2xl transition-all shadow-xl shadow-amber-200/50 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <><Loader2 className="animate-spin w-8 h-8" /> 魔法施展中...</>
            ) : (
              <><Sparkles className="w-8 h-8" /> 诞生我的绘本</>
            )}
          </button>
        </div>

        {/* 绘本播放器展示 */}
        {result && (
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-1000">
            <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-[16px] border-white ring-1 ring-slate-100 relative">
              
              {/* 图片展示区 */}
              <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                <img 
                  src={result[currentPage]} 
                  alt={`第 ${currentPage} 页`}
                  className="w-full h-full object-cover"
                  key={currentPage} 
                />
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                <div className="absolute top-8 right-8 bg-black/30 backdrop-blur-md px-5 py-2 rounded-full text-white font-black text-sm">
                  {currentPage} / {totalPages}
                </div>
              </div>

              {/* 控制与音频区 */}
              <div className="p-8 md:p-12">
                <div className="mb-10 p-6 bg-amber-50 rounded-[2.5rem] border border-amber-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Music className="w-6 h-6 text-amber-500" />
                    <span className="font-black text-amber-900 tracking-tight">故事配音 · 第 {currentPage} 页</span>
                  </div>
                  <audio 
                    key={`audio-${currentPage}`} 
                    controls 
                    src={result[`audio_${currentPage}`] || result.audio} 
                    className="w-full h-10" 
                  />
                </div>

                <div className="flex items-center justify-between gap-8">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="flex-1 py-5 flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 disabled:opacity-20 transition-all font-black text-slate-600"
                  >
                    <ChevronLeft className="w-8 h-8" /> 上一页
                  </button>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="flex-1 py-5 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white hover:bg-black disabled:opacity-20 transition-all font-black shadow-xl"
                  >
                    下一页 <ChevronRight className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}