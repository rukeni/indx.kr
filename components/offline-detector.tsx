'use client';

import type { JSX } from 'react';

import { useEffect, type FC } from 'react';

const OfflineDetector: FC = (): JSX.Element => {
  useEffect((): (() => void) => {
    function handleOnlineStatus(): void {
      const offlineMessage = document.getElementById('offline-message');

      if (!offlineMessage) return;

      if (navigator.onLine) {
        offlineMessage.classList.add('hidden');
      } else {
        offlineMessage.classList.remove('hidden');
      }
    }

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return <></>;
};

export default OfflineDetector;
