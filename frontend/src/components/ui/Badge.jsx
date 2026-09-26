const colorMap = {
  blue: 'bg-brand-500/15 text-brand-400 border-brand-500/20',
  green: 'bg-success/15 text-success border-success/20',
  yellow: 'bg-warning/15 text-warning border-warning/20',
  red: 'bg-error/15 text-error border-error/20',
  purple: 'bg-accent-500/15 text-accent-400 border-accent-500/20',
  gray: 'bg-surface-tertiary text-text-secondary border-border-default',
};

export default function Badge({
  children,
  color = 'blue',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${colorMap[color] || colorMap.gray} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            color === 'green'
              ? 'bg-success'
              : color === 'red'
              ? 'bg-error'
              : color === 'yellow'
              ? 'bg-warning'
              : color === 'blue'
              ? 'bg-brand-400'
              : color === 'purple'
              ? 'bg-accent-400'
              : 'bg-text-muted'
          }`}
        />
      )}
      {children}
    </span>
  );
}
