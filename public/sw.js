const CACHE_NAME = 'meteora-weather-v1.0.0';
const STATIC_CACHE = 'meteora-static-v1.0.0';
const WEATHER_CACHE = 'meteora-weather-data-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Weather API endpoints to cache
const WEATHER_ENDPOINTS = [
  /^https:\/\/api\.openweathermap\.org\/data\/2\.5\/weather/,
  /^https:\/\/api\.openweathermap\.org\/data\/2\.5\/forecast/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== WEATHER_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle weather API requests
  if (isWeatherAPIRequest(url)) {
    event.respondWith(handleWeatherRequest(request));
    return;
  }

  // Handle static file requests
  if (isStaticFileRequest(url)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle other requests
  event.respondWith(
    fetch(request)
      .catch(() => {
        // Fallback for offline
        if (request.destination === 'document') {
          return caches.match('/index.html');
        }
        return new Response('Offline content not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain',
          }),
        });
      })
  );
});

// Check if request is for weather API
function isWeatherAPIRequest(url) {
  return WEATHER_ENDPOINTS.some(pattern => pattern.test(url.href));
}

// Check if request is for static files
function isStaticFileRequest(url) {
  return STATIC_FILES.some(file => url.pathname === file) ||
         url.pathname.startsWith('/static/') ||
         url.pathname.startsWith('/assets/');
}

// Handle weather API requests with caching
async function handleWeatherRequest(request) {
  const cache = await caches.open(WEATHER_CACHE);
  const cachedResponse = await cache.match(request);

  try {
    // Try to fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the fresh response
      const responseToCache = networkResponse.clone();
      cache.put(request, responseToCache);
      
      // Set cache expiration (5 minutes for weather data)
      setTimeout(() => {
        cache.delete(request);
      }, 5 * 60 * 1000);
      
      return networkResponse;
    }
  } catch (error) {
    console.log('Service Worker: Network request failed, using cached data', error);
  }

  // Return cached response if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response
  return new Response(JSON.stringify({
    error: 'Weather data not available offline',
    message: 'Please check your internet connection'
  }), {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
}

// Handle static file requests
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch static file', error);
    return new Response('Static file not available', {
      status: 404,
      statusText: 'Not Found',
    });
  }
}

// Background sync for weather updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'weather-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(syncWeatherData());
  }
});

// Sync weather data in background
async function syncWeatherData() {
  try {
    // Get cached locations
    const cache = await caches.open(WEATHER_CACHE);
    const requests = await cache.keys();
    
    // Update weather data for cached locations
    for (const request of requests) {
      if (isWeatherAPIRequest(new URL(request.url))) {
        try {
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, response.clone());
          }
        } catch (error) {
          console.log('Service Worker: Failed to sync weather data', error);
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Weather update available',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Weather',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Meteora Weather', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_WEATHER') {
    event.waitUntil(cacheWeatherData(event.data.location));
  }
});

// Cache weather data for specific location
async function cacheWeatherData(location) {
  try {
    const cache = await caches.open(WEATHER_CACHE);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${process.env.VITE_WEATHER_API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${process.env.VITE_WEATHER_API_KEY}&units=metric`;
    
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);
    
    if (weatherResponse.ok) {
      cache.put(new Request(weatherUrl), weatherResponse.clone());
    }
    
    if (forecastResponse.ok) {
      cache.put(new Request(forecastUrl), forecastResponse.clone());
    }
    
    console.log('Service Worker: Weather data cached for', location);
  } catch (error) {
    console.error('Service Worker: Failed to cache weather data', error);
  }
} 