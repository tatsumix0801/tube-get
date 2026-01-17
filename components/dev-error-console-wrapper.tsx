'use client';

import { Suspense, useState, useEffect } from 'react';

// クライアント側ラッパーコンポーネント
export default function DevErrorConsoleWrapper() {
  const [DevErrorConsole, setDevErrorConsole] = useState<React.ComponentType | null>(null);
  
  // 本番環境では何も表示しない
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  useEffect(() => {
    // クライアントサイドでのみ動的にインポート
    import('@/components/dev-error-console').then((module) => {
      setDevErrorConsole(() => module.default);
    });
  }, []);
  
  if (!DevErrorConsole) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <DevErrorConsole />
    </Suspense>
  );
} 