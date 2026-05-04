import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onDismiss, variant = 'error' }) => {
  const variants = {
    error: 'bg-red-50 text-red-600 border-red-200',
    warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    info: 'bg-blue-50 text-blue-600 border-blue-200',
    success: 'bg-green-50 text-green-600 border-green-200',
  };

  return (
    <div className={`p-4 rounded-lg border flex items-center justify-between ${variants[variant]}`}>
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-current hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
