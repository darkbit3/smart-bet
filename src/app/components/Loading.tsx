import React from 'react';

export interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring' | 'dual-ring';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  text?: string;
  overlay?: boolean;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

const colorClasses = {
  primary: 'border-t-[#FFD700]',
  secondary: 'border-t-[#FF6B35]',
  accent: 'border-t-[#00D4FF]',
  white: 'border-t-white'
};

const Spinner: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <div className={`${size} rounded-full border-4 border-r-transparent border-b-transparent border-l-transparent animate-spin ${color}`} />
);

const Dots: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <div className="flex space-x-1">
    <div className={`${size.replace('h-', 'h-').replace('w-', 'w-')} bg-[#FFD700] rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
    <div className={`${size.replace('h-', 'h-').replace('w-', 'w-')} bg-[#FFD700] rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
    <div className={`${size.replace('h-', 'h-').replace('w-', 'w-')} bg-[#FFD700] rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
  </div>
);

const Pulse: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <div className={`${size} bg-[#FFD700] rounded-full animate-pulse`} />
);

const Bars: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <div className="flex space-x-1">
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="w-1 bg-[#FFD700] animate-pulse"
        style={{
          height: `${20 + i * 4}px`,
          animationDelay: `${i * 100}ms`,
          animationDuration: '1s'
        }}
      />
    ))}
  </div>
);

const Ring: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <div className="relative">
    <div className={`${size} rounded-full border-4 border-[#FFD700]/20`} />
    <div className={`${size} rounded-full border-4 border-transparent border-t-[#FFD700] animate-spin absolute top-0`} />
  </div>
);

const DualRing: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <div className="relative">
    <div className={`${size} rounded-full border-4 border-[#FFD700]/20 animate-spin`} />
    <div className={`${size.replace('h-', 'h-').replace('w-', 'w-')} rounded-full border-4 border-transparent border-t-[#FFD700] animate-spin absolute top-0`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
  </div>
);

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  overlay = false,
  className = '',
  fullScreen = false
}) => {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <Dots size={sizeClass} color={colorClass} />;
      case 'pulse':
        return <Pulse size={sizeClass} color={colorClass} />;
      case 'bars':
        return <Bars size={sizeClass} color={colorClass} />;
      case 'ring':
        return <Ring size={sizeClass} color={colorClass} />;
      case 'dual-ring':
        return <DualRing size={sizeClass} color={colorClass} />;
      default:
        return <Spinner size={sizeClass} color={colorClass} />;
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {renderLoader()}
      {text && <p className="text-sm text-white/80 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-6 rounded-2xl bg-[#1a1a1a]/90 border border-[#2a2a2a] shadow-2xl">
          {renderLoader()}
          {text && <p className="text-sm text-white animate-pulse font-medium">{text}</p>}
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton Loading Components
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#2a2a2a] rounded ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-32 w-full rounded-lg" />
  </div>
);

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Page Loading Component
export const PageLoading: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="container-modern flex items-center justify-center p-4">
    <div className="flex flex-col items-center justify-center gap-6 px-8 py-8 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-[#FFD700]/20" />
        <div className="h-16 w-16 rounded-full border-4 border-transparent border-t-[#FFD700] animate-spin absolute top-0" />
        <div className="h-8 w-8 rounded-full border-4 border-transparent border-t-[#FF6B35] animate-spin absolute top-4 left-4" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
      </div>
      <div className="text-center">
        <p className="text-lg text-white font-medium animate-pulse">{text}</p>
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  </div>
);

// Button Loading Component
export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const spinnerSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  return <div className={`${spinnerSize} rounded-full border-2 border-white/30 border-t-white animate-spin`} />;
};

// Inline Loading Component
export const InlineLoading: React.FC<{ text?: string; className?: string }> = ({
  text = "Loading...",
  className = ""
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="h-4 w-4 rounded-full border-2 border-[#FFD700] border-t-transparent animate-spin" />
    <span className="text-sm text-white/80">{text}</span>
  </div>
);

export default Loading;
