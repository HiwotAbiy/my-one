
import React, { useState, useEffect, useRef } from 'react';
import { Message, BestieState } from './types.ts';
import { geminiService } from './services/geminiService.ts';
import Bubble from './components/Bubble.tsx';
import FloatingDecorations from './components/FloatingDecorations.tsx';
import { Send, Sparkles, Heart, Coffee, Ghost } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "OMG BESTIE!! ✨ I've been literally waiting for you all day! What's the tea? 💅☕",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bestieStats, setBestieStats] = useState<BestieState>({
    isTyping: false,
    chaoticLevel: 85,
    mood: 'Delusional ✨',
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let responseText = '';
      const stream = geminiService.sendMessageStream(input);
      
      const botMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      for await (const chunk of stream) {
        responseText += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === botMsgId ? { ...msg, text: responseText } : msg
          )
        );
      }
      
      // Update chaotic stats randomly for flavor
      setBestieStats(prev => ({
        ...prev,
        chaoticLevel: Math.min(100, Math.max(50, prev.chaoticLevel + (Math.random() * 10 - 5))),
        mood: responseText.length > 50 ? 'Yapping 🗣️' : 'Judging 💅'
      }));

    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fff5f7] flex flex-col items-center justify-center p-4 md:p-8 selection:bg-pink-200">
      <FloatingDecorations />

      <div className="z-10 w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 flex flex-col overflow-hidden h-[90vh]">
        
        {/* Header */}
        <header className="p-6 border-b border-pink-100 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-300 to-rose-300 flex items-center justify-center text-2xl shadow-inner border-2 border-white">
                🎀
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="font-fredoka text-xl font-bold text-rose-500 tracking-tight">Lets Gist Bestie</h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-pink-400">Online & Judging</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4 items-center">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Mood</span>
              <span className="text-sm font-medium text-rose-400">{bestieStats.mood}</span>
            </div>
            <div className="h-8 w-[1px] bg-pink-100"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Chaos</span>
              <span className="text-sm font-medium text-rose-400">{Math.round(bestieStats.chaoticLevel)}%</span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2">
          {messages.map((msg) => (
            <Bubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <div className="flex justify-start items-center space-x-2 mb-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-xs">💅</span>
              </div>
              <div className="bg-white border border-pink-50 px-4 py-2 rounded-2xl rounded-bl-none text-pink-300 text-xs font-bold">
                Bestie is typing...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </main>

        {/* Input Area */}
        <footer className="p-4 md:p-6 bg-white/40 border-t border-pink-100">
          <div className="flex items-center gap-2 bg-white rounded-full p-2 shadow-sm border border-pink-50 focus-within:ring-2 focus-within:ring-pink-200 transition-all">
            <button className="p-2 hover:bg-pink-50 rounded-full transition-colors group">
              <Sparkles className="w-5 h-5 text-pink-300 group-hover:text-pink-400" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Spill the tea..."
              className="flex-1 bg-transparent border-none focus:outline-none px-2 text-gray-700 placeholder:text-pink-200 font-medium"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`p-3 rounded-full transition-all duration-300 ${
                input.trim() && !isTyping
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105 active:scale-95'
                  : 'bg-gray-100 text-gray-300'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center gap-6 mt-4 opacity-40">
            <Heart className="w-4 h-4 text-rose-300" />
            <Coffee className="w-4 h-4 text-pink-300" />
            <Ghost className="w-4 h-4 text-rose-300" />
          </div>
        </footer>
      </div>
      
      <p className="mt-4 text-[10px] text-pink-400 font-bold uppercase tracking-widest text-center">
        Powered by Pure Chaos & Gemini ✨
      </p>
    </div>
  );
};

export default App;
