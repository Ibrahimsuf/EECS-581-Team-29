"use client";

import { useState, useEffect } from "react";

interface BotAvatarProps {
  isAiTurn: boolean;
  gameStatus: string;
}

export default function BotAvatar({ isAiTurn, gameStatus }: BotAvatarProps) {
  const [showTomatoGif, setShowTomatoGif] = useState(false);

  const handleBotClick = () => {
    setShowTomatoGif(true);  
    setTimeout(() => {
      setShowTomatoGif(false);
    }, 1000); 
  };

  return (
    <div className="relative">
      {/* Bot Avatar */}
      <div
        className={`
          relative w-16 h-16 rounded-full cursor-pointer transition-all duration-300 select-none
          ${isAiTurn 
            ? "opacity-100 shadow-lg animate-pulse" 
            : "opacity-30 shadow-sm hover:opacity-50"
          }
          bg-gray-500
          flex items-center justify-center
          border-2 border-white
        `}
        onClick={handleBotClick}
      >
        <img 
          src="/bot.png" 
          alt="Bot avatar"
          className="w-20 h-20 object-contain"
        />
      </div>

      {/* Tomato Throw GIF Animation */}
      {showTomatoGif && (
        <div className="absolute -top-4 -left-4 w-24 h-24 pointer-events-none z-10">
          <img
            src="/tomato-throw.gif"
            alt="Tomato throwing animation"
            className="w-full h-full object-contain"
          />
        </div>
      )}

    </div>
  );
}