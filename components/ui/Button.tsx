import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text";
  isOutline?: boolean; // To match the Outline variant column from reference
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", isOutline = false, disabled, children, ...props }, ref) => {
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md-custom cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none";

    let variantStyles = "";

    // If disabled, we use a uniform disabled style matching the spec
    if (disabled) {
      if (variant === "text") {
        variantStyles = "bg-transparent text-brand-secondary/40 pointer-events-none";
      } else {
        variantStyles = "bg-bg-secondary text-brand-secondary/40 border border-transparent pointer-events-none px-4 py-2";
      }
    } else {
      switch (variant) {
        case "primary":
          if (isOutline) {
            variantStyles =
              "bg-transparent border border-brand-primary text-brand-primary hover:bg-surface px-4 py-2";
          } else {
            variantStyles =
              "bg-brand-primary text-white border border-brand-primary hover:bg-brand-primary/90 px-4 py-2 shadow-sm-custom";
          }
          break;
        case "secondary":
          if (isOutline) {
            variantStyles =
              "bg-white border border-border-color text-brand-primary hover:bg-surface px-4 py-2";
          } else {
            variantStyles =
              "bg-white border border-border-color text-brand-primary hover:bg-surface px-4 py-2 shadow-sm-custom";
          }
          break;
        case "outline":
          variantStyles =
            "bg-transparent border border-border-color text-brand-primary hover:bg-surface px-4 py-2";
          break;
        case "text":
          variantStyles =
            "bg-transparent text-brand-primary hover:text-right-bias px-2 py-1 rounded-sm-custom";
          break;
      }
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
