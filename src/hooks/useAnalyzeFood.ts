'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/types';

async function compressImage(file: File, maxWidth = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function useAnalyzeFood() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyzeFood(file: File): Promise<AnalysisResult | null> {
    setIsAnalyzing(true);
    setError(null);

    try {
      const compressed = await compressImage(file);
      const mimeType = 'image/jpeg';

      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: compressed, mimeType }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error ?? 'Analysis failed');
      }

      return data.data as AnalysisResult;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze food';
      setError(msg);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }

  return { analyzeFood, isAnalyzing, error };
}
