// components/ui/Checkbox.tsx
import React from 'react';
import { cn } from '@/lib/utils';



const Checkbox = React.forwardRef(
  ({ className, label, containerClass, ...props }, ref) => {
    return (
      <label className={cn('flex items-center space-x-2', containerClass)}>
        <input
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <span className="text-sm font-medium text-gray-700">{label}</span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };