import React from 'react';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({ className = '', orientation = 'horizontal', ...props }: SeparatorProps) {
  return (
    <div
      className={`bg-gray-200 ${
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'
      } ${className}`}
      {...props}
    />
  );
}