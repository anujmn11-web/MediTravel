/**
 * Button Component
 * Consistent, reusable button with variants: primary, secondary, danger
 * All variants automatically adapt to theme and accent color changes via CSS variables
 */

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  as: Component = 'button',
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantStyles = {
    primary: 'bg-[var(--color-accent)] text-white shadow-lg hover:opacity-90 hover:shadow-xl active:opacity-75 disabled:opacity-50',
    secondary: 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50',
    danger: 'bg-[var(--color-danger)] text-white shadow-lg hover:opacity-90 hover:shadow-xl active:opacity-75 disabled:opacity-50',
    outline: 'border-2 border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent hover:bg-[var(--color-accent-light)] disabled:opacity-50',
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <Component
      type={type}
      className={combinedClassName}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Button;
