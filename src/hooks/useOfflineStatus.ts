import { useState, useEffect } from 'react';
import { offlineStorage, type OfflineStats, type OfflineLessonData } from '../lib/offlineStorage';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [stats, setStats] = useState<OfflineStats>(() => {
    return offlineStorage.getStats();
  });

  const [hasRecentSync, setHasRecentSync] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Automatically process offline queue when reconnected
      const syncedCount = offlineStorage.processOfflineQueue();
      if (syncedCount > 0) {
        setHasRecentSync(true);
        setTimeout(() => setHasRecentSync(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleCacheUpdated = () => {
      setStats(offlineStorage.getStats());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('clay_offline_cache_updated', handleCacheUpdated);
    window.addEventListener('clay_offline_queue_synced', () => {
      setHasRecentSync(true);
      setTimeout(() => setHasRecentSync(false), 3000);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('clay_offline_cache_updated', handleCacheUpdated);
    };
  }, []);

  const cacheAll = () => {
    const success = offlineStorage.cacheAllCurriculum();
    if (success) {
      setStats(offlineStorage.getStats());
    }
    return success;
  };

  const clearCache = () => {
    const success = offlineStorage.clearCache();
    if (success) {
      setStats(offlineStorage.getStats());
    }
    return success;
  };

  return {
    isOnline,
    isOffline: !isOnline,
    stats,
    hasRecentSync,
    cacheAll,
    clearCache,
    getLesson: (id: string) => offlineStorage.getLesson(id),
    getAllLessons: () => offlineStorage.getAllLessons()
  };
}
