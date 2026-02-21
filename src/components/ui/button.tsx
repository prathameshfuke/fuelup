import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] uppercase tracking-wider",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-br from-primary to-secondary text-white shadow-[0_0_20px_rgba(0,102,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] hover:scale-[1.02]",
                destructive: "bg-gradient-to-br from-destructive to-orange-500 text-white shadow-[0_0_20px_rgba(255,0,57,0.3)] hover:shadow-[0_0_30px_rgba(255,0,57,0.5)] hover:scale-[1.02]",
                outline: "border-2 border-primary/50 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_15px_rgba(0,102,255,0.2)]",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-primary/10 hover:text-primary",
                link: "text-primary underline-offset-4 hover:underline",
                success: "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md hover:shadow-lg hover:scale-[1.02]",
                warning: "bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-md hover:shadow-lg hover:scale-[1.02]",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-lg px-4 text-xs",
                lg: "h-14 rounded-2xl px-8 text-base",
                xl: "h-16 rounded-2xl px-10 text-lg",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
