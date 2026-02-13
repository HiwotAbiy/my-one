
import React from 'react';

const FloatingDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Sparkles and Hearts */}
      <div className="absolute top-10 left-10 text-pink-300 animate-bounce opacity-40">✨</div>
      <div className="absolute top-20 right-20 text-rose-300 animate-pulse opacity-40 text-2xl">💖</div>
      <div className="absolute bottom-40 left-10 text-pink-200 animate-bounce delay-75 opacity-40 text-3xl">🌸</div>
      <div className="absolute bottom-20 right-10 text-rose-200 animate-pulse delay-100 opacity-40">🧸</div>
      <div className="absolute top-1/2 left-4 text-pink-100 animate-pulse opacity-30 text-4xl">🍡</div>
      <div className="absolute top-1/3 right-4 text-rose-100 animate-bounce opacity-30 text-5xl">🎀</div>
      
      {/* Gradient Blobs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-50"></div>
    </div>
  );
};

export default FloatingDecorations;
