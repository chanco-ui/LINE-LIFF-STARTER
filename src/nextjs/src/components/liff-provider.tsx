'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';

interface LiffProviderProps {
  children: React.ReactNode;
}

export function LiffProvider({ children }: LiffProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
          throw new Error('LIFF ID is not defined');
        }

        // デバッグ情報の出力
        console.log('=== LIFF Debug Information ===');
        console.log('LIFF ID:', liffId);
        console.log('Current URL:', window.location.href);
        console.log('Environment:', process.env.NODE_ENV);
        console.log('User Agent:', navigator.userAgent);
        console.log('===========================');

        // 開発環境かどうかを確認
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        // LIFFの初期化
        await liff.init({
          liffId,
          withLoginOnExternalBrowser: true
        });
        console.log('LIFF initialized successfully');

        // ログイン状態の確認
        if (!liff.isLoggedIn()) {
          console.log('User is not logged in, redirecting to login');
          // 本番環境の場合は、NetlifyのURLを使用
          const redirectUri = isDevelopment 
            ? window.location.href 
            : 'https://soft-speculoos-eee6be.netlify.app';
          console.log('Redirect URI:', redirectUri);
          liff.login({ redirectUri });
        } else {
          console.log('User is already logged in');
          console.log('User Profile:', await liff.getProfile());
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('LIFF initialization error:', error);
        if (error instanceof Error) {
          const errorMessage = `LIFF初期化エラー: ${error.message}\n
URL: ${window.location.href}\n
LIFF ID: ${process.env.NEXT_PUBLIC_LIFF_ID}\n
Environment: ${process.env.NODE_ENV}\n
User Agent: ${navigator.userAgent}`;
          setError(errorMessage);
        } else {
          setError('不明なエラーが発生しました');
        }
      }
    };

    initLiff();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{error}</p>
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">設定情報</h3>
            <p className="text-sm text-gray-500">
              LIFF ID: {process.env.NEXT_PUBLIC_LIFF_ID || '未設定'}<br />
              Environment: {process.env.NODE_ENV}<br />
              URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}<br />
              User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">読み込み中...</h2>
          <p className="text-gray-600">LINEログインを処理しています</p>
        </div>
      </div>
    );
  }

  return <main className="min-h-screen bg-gray-50">{children}</main>;
} 