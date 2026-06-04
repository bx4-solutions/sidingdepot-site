import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-sm font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-sd-green text-sd-black hover:bg-sd-green-hover active:bg-sd-green-active shadow-sm",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-sd-green bg-transparent text-sd-green hover:bg-sd-green hover:text-sd-black active:bg-sd-green-hover",
        outlineWhite:
          "border-2 border-white bg-transparent text-white hover:bg-white hover:text-sd-black",
        dark: "bg-sd-navy text-sd-green hover:bg-sd-dark shadow-sm",
        white: "bg-white text-sd-black shadow-md hover:bg-sd-gray-bg",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-sd-green underline-offset-4 hover:underline active:text-sd-green-hover rounded-none",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
