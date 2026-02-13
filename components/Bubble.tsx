
import React from 'react';
import { Message } from '../types';

interface BubbleProps {
  message: Message;
}

const Bubble: React.FC<BubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center mr-2 shadow-sm border border-white flex-shrink-0 mt-auto">
          <span className="text-xs">🎀</span>
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base transition-all duration-300 ${
          isUser
            ? 'bg-gradient-to-br from-pink-400 to-rose-400 text-white rounded-br-none'
            : 'bg-white text-gray-800 border border-pink-100 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        <span className={`text-[10px] block mt-1 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center ml-2 shadow-sm border border-white flex-shrink-0 mt-auto">
          <span className="text-xs">⭐</span>
        </div>
      )}
    </div>
  );
};

export default Bubble;
