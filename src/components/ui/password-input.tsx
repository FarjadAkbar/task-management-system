import * as React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { cn } from "@/lib/utils";

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => {
      setIsVisible((prev) => !prev);
    };

    return (
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-10", // Add padding-right for the icon
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
