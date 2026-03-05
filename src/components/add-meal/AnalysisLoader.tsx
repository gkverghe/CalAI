'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  'Identifying foods...',
  'Estimating portions...',
  'Calculating nutrition...',
  'Almost done...',
];

interface AnalysisLoaderProps {
  imageUrl?: string;
}

export function AnalysisLoader({ imageUrl }: AnalysisLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="Analyzing..."
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
        />
      )}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-blue-300/40 border-t-[#2563eb] animate-spin" />
        <p className="text-white font-medium text-center transition-all">
          {MESSAGES[msgIndex]}
        </p>
      </div>
    </div>
  );
}
