import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'flex h-12 w-full rounded-xl border-2 border-border/50 bg-background/50 px-4 py-2 text-base backdrop-blur-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-secondary focus-visible:shadow-[0_0_15px_rgba(0,217,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';

export { Input };
