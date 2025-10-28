import React from "react";
import { cn } from "@/lib/utils";

/**
 * Flexible Skeleton component
 * Props:
 * - as: element or component to render (default: 'div')
 * - className: additional classes
 * - other props passed through
 */
const Skeleton = React.forwardRef(
  ({ as: Component = "div", className = "", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        data-slot="skeleton"
        className={cn("bg-accent animate-pulse rounded-md", className)}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
