import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { BottomNav } from '@/components/bottom-nav';
import { ErrorBoundary } from '@/components/error-boundary';

export const metadata: Metadata = {
  title: {
    default: '校园跑腿APP',
    template: '%s | 校园跑腿APP',
  },
  description: '校园跑腿互助平台，发布和接收跑腿任务，让校园生活更便利。',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '校园跑腿',
  },
  icons: {
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#10B981',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <div className="mx-auto max-w-md pb-24 safe-area-bottom">
              {children}
            </div>
            <BottomNav />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
