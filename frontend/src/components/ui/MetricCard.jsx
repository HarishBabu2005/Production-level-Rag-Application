import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-brand-400',
  iconBg = 'bg-brand-500/10',
  index = 0,
}) {
  const trend =
    change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

  return (
    <div
      className={`glass rounded-xl p-5 hover:border-border-hover transition-default
        animate-fade-in-up ${
          index === 1
            ? 'animate-delay-100'
            : index === 2
            ? 'animate-delay-200'
            : index === 3
            ? 'animate-delay-300'
            : ''
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}
          >
            <Icon size={18} className={iconColor} />
          </div>
        )}
      </div>

      <p className="text-2xl font-bold text-text-primary tracking-tight">
        {value}
      </p>

      {(change !== undefined || changeLabel) && (
        <div className="flex items-center gap-1.5 mt-2">
          {change !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                trend === 'up'
                  ? 'text-success'
                  : trend === 'down'
                  ? 'text-error'
                  : 'text-text-muted'
              }`}
            >
              {trend === 'up' && <TrendingUp size={12} />}
              {trend === 'down' && <TrendingDown size={12} />}
              {trend === 'neutral' && <Minus size={12} />}
              {change > 0 ? '+' : ''}
              {change}%
            </span>
          )}
          {changeLabel && (
            <span className="text-xs text-text-muted">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
