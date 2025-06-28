import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

interface UserInteraction {
  type: 'click' | 'scroll' | 'search' | 'location_change' | 'component_render';
  timestamp: number;
  details?: Record<string, any>;
}

interface PerformanceData {
  metrics: PerformanceMetrics;
  interactions: UserInteraction[];
  errors: Error[];
  apiCalls: Array<{
    endpoint: string;
    duration: number;
    status: number;
    timestamp: number;
  }>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private interactions: UserInteraction[] = [];
  private errors: Error[] = [];
  private apiCalls: Array<{
    endpoint: string;
    duration: number;
    status: number;
    timestamp: number;
  }> = [];

  constructor() {
    this.metrics = this.initializeMetrics();
    this.setupObservers();
  }

  private initializeMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      timeToInteractive: navigation ? navigation.domInteractive - navigation.fetchStart : 0,
    };
  }

  private setupObservers() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const firstInputEntry = entry as any;
          this.metrics.firstInputDelay = firstInputEntry.processingStart - firstInputEntry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  trackInteraction(type: UserInteraction['type'], details?: Record<string, any>) {
    this.interactions.push({
      type,
      timestamp: Date.now(),
      details,
    });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`Performance: ${type} interaction tracked`, details);
    }
  }

  trackError(error: Error) {
    this.errors.push(error);
    
    if (import.meta.env.DEV) {
      console.error('Performance: Error tracked', error);
    }
  }

  trackAPICall(endpoint: string, duration: number, status: number) {
    this.apiCalls.push({
      endpoint,
      duration,
      status,
      timestamp: Date.now(),
    });

    // Warn if API call is slow
    if (duration > 3000) {
      console.warn(`Performance: Slow API call detected - ${endpoint} took ${duration}ms`);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getInteractions(): UserInteraction[] {
    return [...this.interactions];
  }

  getErrors(): Error[] {
    return [...this.errors];
  }

  getAPICalls() {
    return [...this.apiCalls];
  }

  generateReport(): PerformanceData {
    return {
      metrics: this.getMetrics(),
      interactions: this.getInteractions(),
      errors: this.getErrors(),
      apiCalls: this.getAPICalls(),
    };
  }

  sendReport() {
    const report = this.generateReport();
    
    // In production, send to analytics service
    if (import.meta.env.PROD) {
      // Example: Analytics.track('performance_report', report);
      console.log('Performance Report:', report);
    }
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

export const usePerformanceMonitor = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      
      // Track initial page load
      performanceMonitor.trackInteraction('scroll', { initial: true });
      
      // Set up periodic reporting
      const reportInterval = setInterval(() => {
        performanceMonitor.sendReport();
      }, 60000); // Report every minute

      return () => clearInterval(reportInterval);
    }
  }, []);

  const trackInteraction = useCallback((type: UserInteraction['type'], details?: Record<string, any>) => {
    performanceMonitor.trackInteraction(type, details);
  }, []);

  const trackError = useCallback((error: Error) => {
    performanceMonitor.trackError(error);
  }, []);

  const trackAPICall = useCallback((endpoint: string, duration: number, status: number) => {
    performanceMonitor.trackAPICall(endpoint, duration, status);
  }, []);

  const getMetrics = useCallback(() => {
    return performanceMonitor.getMetrics();
  }, []);

  const generateReport = useCallback(() => {
    return performanceMonitor.generateReport();
  }, []);

  return {
    trackInteraction,
    trackError,
    trackAPICall,
    getMetrics,
    generateReport,
  };
};

// Hook for tracking component render performance
export const useRenderPerformance = (componentName: string) => {
  const renderStart = useRef<number>(0);
  const { trackInteraction } = usePerformanceMonitor();

  useEffect(() => {
    renderStart.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStart.current;
      
      if (renderTime > 16) { // Longer than one frame (16.67ms)
        console.warn(`Performance: Slow render detected in ${componentName} - ${renderTime.toFixed(2)}ms`);
      }
      
      trackInteraction('component_render', {
        component: componentName,
        renderTime,
      });
    };
  });
};

// Hook for tracking scroll performance
export const useScrollPerformance = () => {
  const { trackInteraction } = usePerformanceMonitor();
  const scrollTimeout = useRef<number>();

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = window.setTimeout(() => {
        trackInteraction('scroll', {
          scrollY: window.scrollY,
          scrollX: window.scrollX,
        });
      }, 100); // Debounce scroll events
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [trackInteraction]);
};

export default usePerformanceMonitor; 