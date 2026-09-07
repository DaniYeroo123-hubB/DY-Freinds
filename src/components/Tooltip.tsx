import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  id?: string;
  position?: 'top' | 'bottom';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  id,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {/* Custom styled tooltip popup */}
      <div
        id={id}
        role="tooltip"
        aria-hidden={!isVisible}
        className={`absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200 ease-out z-50 ${
          position === 'top'
            ? 'bottom-full mb-2.5 origin-bottom'
            : 'top-full mt-2.5 origin-top'
        } ${
          isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-1'
        }`}
      >
        <div className="relative px-2.5 py-1 rounded-md bg-zinc-950/95 border border-rose-400/40 text-rose-100 text-[11px] font-medium tracking-wide shadow-[0_4px_20px_rgba(244,63,94,0.3)] backdrop-blur-md whitespace-nowrap flex items-center gap-1.5 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span>{content}</span>
          {/* Arrow notch */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-zinc-950 border-rose-400/40 rotate-45 ${
              position === 'top'
                ? '-bottom-[3.5px] border-r border-b'
                : '-top-[3.5px] border-l border-t'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
