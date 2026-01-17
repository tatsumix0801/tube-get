'use client';

import { Suspense, useEffect, useState } from 'react';
import type { ComponentType } from 'react';

// クライアント側ラッパーコンポーネント
export default function DevErrorConsoleWrapper() {
  const [DevErrorConsole, setDevErrorConsole] = useState<ComponentType | null>(null);
  const isProduction = process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (isProduction) {
      return;
    }

    // クライアントサイドでのみ動的にインポート
    import('@/components/dev-error-console').then((module) => {
      setDevErrorConsole(() => module.default);
    });
  }, [isProduction]);

  // 本番環境では何も表示しない
  if (isProduction) {
    return null;
  }
  
  if (!DevErrorConsole) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <DevErrorConsole />
    </Suspense>
  );
} 
