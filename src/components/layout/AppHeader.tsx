import { ChevronDown } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#1a1a2e] flex items-center justify-center px-4 h-12 shrink-0">
      <button className="flex items-center gap-1.5">
        <span className="text-white font-semibold text-base tracking-tight">
          Calorie Tracking App
        </span>
        <ChevronDown size={16} className="text-white/70" />
      </button>
    </header>
  );
}
