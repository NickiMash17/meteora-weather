import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import '../styles/ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Weather App Error:', error, errorInfo);
    
    // Log error to monitoring service (Sentry, LogRocket, etc.)
    this.logError(error, errorInfo);
    
    this.setState({ error, errorInfo });
  }

  logError = (error: Error, errorInfo: ErrorInfo) => {
    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.error('Production Error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-purple-900 to-blue-900">
          <div className="relative z-10 max-w-md mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-8 rounded-3xl"
            >
              {/* Error Icon */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-6"
              >
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </div>
              </motion.div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-white mb-4">
                Oops! Something went wrong
              </h1>
              
              <p className="text-white/70 mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 bg-red-500/10 rounded-lg text-left"
                >
                  <details className="text-sm text-white/80">
                    <summary className="cursor-pointer font-semibold mb-2">
                      Error Details (Development)
                    </summary>
                    <div className="space-y-2">
                      <div>
                        <strong>Message:</strong> {this.state.error.message}
                      </div>
                      <div>
                        <strong>Stack:</strong>
                        <pre className="text-xs mt-1 overflow-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="text-xs mt-1 overflow-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleRetry}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={this.handleGoHome}
                  className="w-full py-3 px-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </motion.button>

                {/* Report Bug Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const errorReport = {
                      message: this.state.error?.message,
                      stack: this.state.error?.stack,
                      componentStack: this.state.errorInfo?.componentStack,
                      userAgent: navigator.userAgent,
                      url: window.location.href,
                      timestamp: new Date().toISOString(),
                    };
                    
                    // Copy error report to clipboard
                    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
                    alert('Error report copied to clipboard. Please send it to our support team.');
                  }}
                  className="w-full py-2 px-4 bg-white/5 backdrop-blur-md border border-white/10 text-white/70 rounded-lg text-sm hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Bug className="w-4 h-4" />
                  Report Bug
                </motion.button>
              </div>

              {/* Error ID for Support */}
              <div className="mt-6 text-xs text-white/50">
                Error ID: {this.state.error?.message?.slice(0, 8)}...
              </div>
            </motion.div>
          </div>

          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 bg-red-500/20 rounded-full blur-xl" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;