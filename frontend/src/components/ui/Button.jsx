const variants = {
  primary:
    'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/20',
  secondary:
    'bg-surface-tertiary hover:bg-surface-elevated text-text-primary border border-border-default',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
  danger: 'bg-error/10 hover:bg-error/20 text-error border border-error/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-default cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && !iconRight && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
      {Icon && iconRight && <Icon size={size === 'sm' ? 14 : 16} />}
    </button>
  );
}
