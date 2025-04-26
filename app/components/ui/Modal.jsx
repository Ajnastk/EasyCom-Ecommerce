// components/ui/Modal.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';


const Modal = React.forwardRef(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      size = 'md',
      closeOnOverlayClick = true,
    },
    ref
  ) => {
    React.useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };

      if (isOpen) {
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleEscape);
      }

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className={cn(
            'flex min-h-screen items-center justify-center p-4 text-center',
            'sm:block sm:p-0'
          )}
        >
          {/* Background overlay */}
          <div
            className={cn(
              'fixed inset-0 transition-opacity',
              'bg-black bg-opacity-50',
              closeOnOverlayClick ? 'cursor-pointer' : 'cursor-default'
            )}
            aria-hidden="true"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Modal container */}
          <div
            ref={ref}
            className={cn(
              'inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all',
              'sm:my-8 sm:w-full sm:align-middle',
              sizeClasses[size]
            )}
          >
            {/* Header */}
            {(title || description) && (
              <div className="border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  {title && (
                    <h3 className="text-lg font-medium text-gray-900">
                      {title}
                    </h3>
                  )}
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {description && (
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-4">{children}</div>

            {/* Footer (optional) */}
            {/* You can add a default footer here or pass it as children */}
          </div>
        </div>
      </div>
    );
  }
);
Modal.displayName = 'Modal';

export { Modal };