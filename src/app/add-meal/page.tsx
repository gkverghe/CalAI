'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { PhotoUploader } from '@/components/add-meal/PhotoUploader';
import { AnalysisLoader } from '@/components/add-meal/AnalysisLoader';
import { MealReviewForm } from '@/components/add-meal/MealReviewForm';
import { useAnalyzeFood } from '@/hooks/useAnalyzeFood';
import { AnalysisResult } from '@/types';
import { toast } from 'sonner';
import { getDefaultMealCategory } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Step = 'upload' | 'analyzing' | 'review';
type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'LUNCH', label: 'Lunch' },
  { value: 'DINNER', label: 'Dinner' },
  { value: 'SNACK', label: 'Snack' },
];

export default function AddMealPage() {
  const { analyzeFood, isAnalyzing } = useAnalyzeFood();
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [mealType, setMealType] = useState<MealType>(getDefaultMealCategory());

  function handleFile(f: File) {
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
  }

  function handleClear() {
    setFile(null);
    setImageUrl(undefined);
    setImageBase64(undefined);
  }

  async function handleAnalyze() {
    if (!file) return;

    // Read base64 for saving later
    const reader = new FileReader();
    reader.onload = (e) => setImageBase64(e.target?.result as string);
    reader.readAsDataURL(file);

    setStep('analyzing');
    const result = await analyzeFood(file);

    if (!result) {
      toast.error('Could not analyze the photo. Please try again with a clearer image.');
      setStep('upload');
      return;
    }

    setAnalysis(result);
    setStep('review');
  }

  function handleRetake() {
    setFile(null);
    setImageUrl(undefined);
    setImageBase64(undefined);
    setAnalysis(null);
    setStep('upload');
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Add Meal</h1>
        <p className="text-sm text-gray-500">Upload a photo to track your nutrition</p>
      </div>

      {/* Step 2: Analyzing */}
      {step === 'analyzing' && (
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <AnalysisLoader imageUrl={imageUrl} />
        </div>
      )}

      {/* Step 3: Review */}
      {step === 'review' && analysis && (
        <MealReviewForm
          analysis={analysis}
          imageBase64={imageBase64}
          onRetake={handleRetake}
        />
      )}

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <>
          {/* Image Upload Card */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <PhotoUploader onFile={handleFile} onClear={handleClear} />
          </div>

          {/* Meal Type Selection (shown when image selected) */}
          {file && (
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Meal Type</h2>
              <div className="grid grid-cols-2 gap-3">
                {MEAL_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setMealType(type.value)}
                    className={cn(
                      'py-3 px-4 rounded-xl font-medium transition-all',
                      mealType === type.value
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gradient Analyze Button */}
          {file && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Meal
                </>
              )}
            </button>
          )}
        </>
      )}

      {/* Info Card (always visible in upload step) */}
      {step === 'upload' && (
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">AI-Powered Analysis:</span> Our smart system will identify your meal and estimate nutritional information automatically.
          </p>
        </div>
      )}
    </div>
  );
}
