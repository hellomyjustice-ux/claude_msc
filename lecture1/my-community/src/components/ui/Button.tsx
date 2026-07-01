import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantClasses = {
  primary:
    'bg-[#2B3A4E] text-[#F0ECE0] border border-[#2B3A4E] hover:bg-[#1E2B38] hover:border-[#1E2B38] disabled:opacity-50',
  secondary:
    'bg-transparent text-[#2B3A4E] border border-[#2B3A4E] hover:bg-[#2B3A4E] hover:text-[#F0ECE0] disabled:opacity-50',
  ghost:
    'bg-transparent text-[#2B3A4E] border border-transparent hover:border-[#D4C49A] hover:bg-[#D4C49A]/30 disabled:opacity-50',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs tracking-widest',
  md: 'px-5 py-2.5 text-sm tracking-wider',
  lg: 'px-7 py-3 text-sm tracking-widest',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          'inline-flex items-center justify-center gap-2 uppercase font-medium transition-colors duration-200 cursor-pointer',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
