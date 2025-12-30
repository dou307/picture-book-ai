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
        
        // --- 核心修复逻辑开始 ---
        if (finalData && typeof finalData.text === 'string') {
          const trimmedText = finalData.text.trim();
          
          // 只有当字符串以 { 或 [ 开头时，才尝试进行 JSON 解析
          if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
            try {
              finalData = JSON.parse(trimmedText);
            } catch (e) {
              console.warn("检测到 JSON 格式但解析失败，保持原样", e);
              // 如果解析失败，finalData 保持为原本的对象
            }
          } else {
            // 如果字符串不是 JSON 格式（比如直接是一个 URL）
            // 我们手动把它包装成页面需要的格式：{ "1": "url..." }
            finalData = { "1": trimmedText };
          }
        }
        // --- 核心修复逻辑结束 ---
        
        setResult(finalData); 
      } else {
        alert("生成出错：" + (data.error || "未知错误"));
      }
    } catch (error) {
      console.error("请求失败:", error);
      alert("网络连接失败，请检查终端运行状态");
    } finally {
      setLoading(false);
    }
  };

  // 获取总页数
  const totalPages = result ? Object.keys(result).filter(k => !isNaN(Number(k))).length : 0;

  return (
    <div className="min-h-screen bg-[#fffcf5] text-slate-800 pb-20">
      <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-amber-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 text-shadow-sm">AI 梦幻绘本馆</h1>
          <p className="text-lg text-slate-600 font-medium">定制你的专属有声童话</p>
        </div>

        {/* 交互控制中心 */}
        <div className="bg-white border-2 border-amber-100 rounded-[2.5rem] shadow-xl p-6 md:p-10 mb-12 transition-all hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 1. 角色选择 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-400 text-center uppercase tracking-wider">阅读对象</label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setRole('child')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${role === 'child' ? 'bg-white shadow-md text-amber-600 scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Baby className="w-4 h-4" /> 宝贝
                </button>
                <button 
                  onClick={() => setRole('parent')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${role === 'parent' ? 'bg-white shadow-md text-amber-600 scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <User className="w-4 h-4" /> 家长
                </button>
              </div>
            </div>

            {/* 2. 输入方式 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-400 text-center uppercase tracking-wider">输入方式</label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setInputType('text')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${inputType === 'text' ? 'bg-white shadow-md text-blue-600 scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Keyboard className="w-4 h-4" /> 文字
                </button>
                <button 
                  onClick={() => setInputType('voice')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${inputType === 'voice' ? 'bg-white shadow-md text-blue-600 scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Mic className="w-4 h-4" /> 语音
                </button>
              </div>
            </div>

            {/* 3. 风格选择 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-400 text-center uppercase tracking-wider">主角类型</label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setStyle('animal')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${style === 'animal' ? 'bg-white shadow-md text-green-600 scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Dog className="w-4 h-4" /> 动物
                </button>
                <button 
                  onClick={() => setStyle('human')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold ${style === 'human' ? 'bg-white shadow-md text-green-600 scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <UserRound className="w-4 h-4" /> 人类
                </button>
              </div>
            </div>
          </div>

          {/* 输入区域 */}
          {inputType === 'text' ? (
            <textarea
              className="w-full text-lg p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-amber-200 focus:bg-white outline-none min-h-[120px] resize-none text-slate-700 transition-all placeholder:text-slate-300"
              placeholder={`以${role === 'child' ? '宝贝' : '家长'}的视角，写一个${style === 'animal' ? '小动物' : '小朋友'}的故事...`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          ) : (
            <div className="w-full min-h-[120px] flex flex-col items-center justify-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-white mb-3 cursor-pointer hover:scale-110 transition-transform shadow-xl shadow-amber-200">
                <Mic className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-medium text-sm">点击开始录制您的创意</p>
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-8 py-5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-[1.5rem] font-bold text-2xl transition-all shadow-xl shadow-amber-100 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <><Loader2 className="animate-spin w-7 h-7" /> 正在创作梦幻绘本...</>
            ) : (
              <><Sparkles className="w-7 h-7" /> 开始创作绘本</>
            )}
          </button>
        </div>

        {/* 绘本播放器展示 */}
        {result && (
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-700">
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-white ring-1 ring-slate-200 relative">
              
              {/* 图片展示区 */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img 
                  src={result[currentPage]} 
                  alt={`第 ${currentPage} 页`}
                  className="w-full h-full object-cover"
                  key={currentPage} 
                />
                {/* 书脊阴影 */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                
                {/* 页码 */}
                <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-lg">
                  {currentPage} / {totalPages}
                </div>
              </div>

              {/* 控制与音频区 */}
              <div className="p-8 md:p-10">
                {/* 该页音频 */}
                <div className="mb-8 p-5 bg-amber-50 rounded-3xl border border-amber-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-amber-500 rounded-xl text-white shadow-md shadow-amber-200">
                      <Music className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-amber-900">第 {currentPage} 页故事朗读</span>
                  </div>
                  <audio 
                    key={`audio-${currentPage}`} 
                    controls 
                    src={result[`audio_${currentPage}`] || result.audio} 
                    className="w-full h-10" 
                  />
                </div>

                {/* 翻页导航 */}
                <div className="flex items-center justify-between gap-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="flex-1 py-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 disabled:opacity-20 transition-all font-bold text-slate-600 hover:border-amber-200"
                  >
                    <ChevronLeft className="w-6 h-6" /> 上一页
                  </button>
                  
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="flex-1 py-4 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-20 transition-all font-bold shadow-lg"
                  >
                    下一页 <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* 功能区 */}
            <div className="flex justify-center mt-10 gap-8">
              <button className="text-slate-400 hover:text-amber-600 font-bold transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" /> 保存绘本 PDF
              </button>
              <div className="w-px h-4 bg-slate-200 my-auto" />
              <button className="text-slate-400 hover:text-amber-600 font-bold transition-colors flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 分享给好友
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
  
}