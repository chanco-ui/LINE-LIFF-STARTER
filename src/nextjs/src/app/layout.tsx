import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LiffProvider } from '@/components/liff-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Workout Tracker',
  description: '筋トレ記録アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <LiffProvider>{children}</LiffProvider>
      </body>
    </html>
  );
} 