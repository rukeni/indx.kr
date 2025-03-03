'use client';

import type { JSX } from 'react';

import { AlertCircle } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';

const OfflineDetector: FC = (): JSX.Element => {
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect((): (() => void) => {
    function handleOnlineStatus(): void {
      setIsOffline(!navigator.onLine);
    }

    // 초기 상태 확인
    handleOnlineStatus();

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  if (!isOffline) return <></>;

  return (
    <Alert
      variant="destructive"
      className="fixed bottom-4 right-4 max-w-md z-50"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.
      </AlertDescription>
    </Alert>
  );
};

export default OfflineDetector;
