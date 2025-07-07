import React from 'react';

interface ErrorCardProps {
  message: string;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message, icon, onRetry, retryLabel = 'Retry' }) => {
  return (
    <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl max-w-md mx-auto animate-fade-in">
      {icon && <div className="mb-4 text-5xl animate-bounce-slow">{icon}</div>}
      <div className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Oops!</div>
      <div className="text-base text-gray-700 dark:text-gray-200 mb-4">{message}</div>
      {onRetry && (
        <button
          className="mt-2 px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={onRetry}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorCard; 