'use client';

import { useCallback, useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface PhotoUploaderProps {
  onFile: (file: File) => void;
  onClear?: () => void;
}

export function PhotoUploader({ onFile, onClear }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFile(file);
    },
    [onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />

      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Selected meal"
            className="w-full aspect-square object-cover rounded-2xl"
          />
          <button
            onClick={clear}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Dashed tap-to-photo area */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Camera className="w-16 h-16 text-gray-400" />
            <div className="text-center">
              <p className="font-medium text-gray-900">Take or Upload Photo</p>
              <p className="text-sm text-gray-500 mt-1">Tap to select an image</p>
            </div>
          </button>

          {/* Solid blue gallery button */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full py-4 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Choose from Gallery
          </button>
        </div>
      )}
    </div>
  );
}
