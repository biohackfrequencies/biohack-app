import { useCallback } from 'react';

export const useServiceWorker = () => {
    const isUpdateAvailable = false;
    const updateAssets = useCallback(() => {
      // No-op. The service worker has been disabled.
    }, []);

    // The service worker functionality has been disabled as it was causing
    // deployment caching issues. An empty sw.js file has been provided to
    // effectively unregister the old service worker for existing users.

    return { isUpdateAvailable, updateAssets };
};
