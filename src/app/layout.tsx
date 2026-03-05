import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toaster } from '@/components/ui/sonner';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CalAI — AI Calorie Tracker',
  description: 'Track your calories with AI-powered food photo analysis',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased bg-gray-50 text-gray-900`}>
        <div className="min-h-screen flex justify-center bg-gray-50">
          <div className="w-full max-w-lg relative flex flex-col">
            <main className="flex-1 pb-24">{children}</main>
            <BottomNav />
          </div>
        </div>
        <Toaster
          toastOptions={{
            style: {
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              color: '#111827',
            },
          }}
        />
      </body>
    </html>
  );
}
