export default function Card({
  children,
  className = '',
  gradient = false,
  hover = false,
  ...props
}) {
  return (
    <div
      className={`rounded-xl border border-border-default bg-surface-card
        ${gradient ? 'gradient-border' : ''}
        ${hover ? 'hover:border-border-hover hover:shadow-elevated transition-default' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-border-default ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}
