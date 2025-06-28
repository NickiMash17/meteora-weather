// Service Worker Registration Utility
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              showUpdateNotification();
            }
          });
        }
      });

      // Handle service worker errors
      registration.addEventListener('error', (error) => {
        console.error('Service Worker error:', error);
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }
  return null;
};

// Show update notification
const showUpdateNotification = () => {
  if (confirm('A new version of Meteora Weather is available! Would you like to update now?')) {
    window.location.reload();
  }
};

// Cache weather data for offline use
export const cacheWeatherData = async (location: string) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_WEATHER',
        location
      });
      console.log('Weather data caching requested for:', location);
    } catch (error) {
      console.error('Failed to request weather caching:', error);
    }
  }
};

// Request background sync
export const requestBackgroundSync = async (tag: string) => {
  if ('serviceWorker' in navigator && 'sync' in (window.ServiceWorkerRegistration.prototype as any)) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(tag);
      console.log('Background sync registered:', tag);
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }
};

// Check if app is installed as PWA
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// Send push notification
export const sendPushNotification = (title: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      ...options
    });
  }
};

// Get app installation prompt
export const getInstallPrompt = () => {
  let deferredPrompt: any;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
  
  return deferredPrompt;
};

// Install PWA
export const installPWA = async () => {
  const prompt = getInstallPrompt();
  if (prompt) {
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      console.log('PWA installed successfully');
      return true;
    }
  }
  return false;
};

// Check network status
export const getNetworkStatus = () => {
  return {
    online: navigator.onLine,
    effectiveType: (navigator as any).connection?.effectiveType || 'unknown',
    downlink: (navigator as any).connection?.downlink || 0,
    rtt: (navigator as any).connection?.rtt || 0
  };
};

// Monitor network changes
export const onNetworkChange = (callback: (status: ReturnType<typeof getNetworkStatus>) => void) => {
  const handleOnline = () => callback(getNetworkStatus());
  const handleOffline = () => callback(getNetworkStatus());
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  if ('connection' in navigator) {
    (navigator as any).connection.addEventListener('change', () => callback(getNetworkStatus()));
  }
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    if ('connection' in navigator) {
      (navigator as any).connection.removeEventListener('change', () => callback(getNetworkStatus()));
    }
  };
}; 