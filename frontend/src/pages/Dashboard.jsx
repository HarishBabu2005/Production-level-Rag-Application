import {
  FileText,
  Database,
  MessageSquare,
  Target,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  Server,
  HardDrive,
  Cpu,
  Zap,
} from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const metrics = [
  {
    label: 'Total Documents',
    value: '0',
    icon: FileText,
    iconColor: 'text-brand-400',
    iconBg: 'bg-brand-500/10',
  },
  {
    label: 'Indexed Documents',
    value: '0',
    icon: Database,
    iconColor: 'text-accent-400',
    iconBg: 'bg-accent-500/10',
  },
  {
    label: 'Total Queries',
    value: '0',
    icon: MessageSquare,
    iconColor: 'text-success',
    iconBg: 'bg-success/10',
  },
  {
    label: 'Retrieval Accuracy',
    value: '—',
    icon: Target,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
  },
];

const recentActivity = [
  {
    id: 1,
    icon: CheckCircle2,
    iconColor: 'text-success',
    text: 'System initialized successfully',
    time: 'Just now',
  },
  {
    id: 2,
    icon: Server,
    iconColor: 'text-brand-400',
    text: 'API server started on port 5000',
    time: 'Just now',
  },
  {
    id: 3,
    icon: Clock,
    iconColor: 'text-text-muted',
    text: 'Waiting for first document upload',
    time: 'Pending',
  },
  {
    id: 4,
    icon: AlertCircle,
    iconColor: 'text-warning',
    text: 'Vector database not yet configured',
    time: 'Action needed',
  },
];

const systemComponents = [
  { label: 'API Server', status: 'operational', icon: Server },
  { label: 'Database', status: 'connected', icon: HardDrive },
  { label: 'Embedding Engine', status: 'not configured', icon: Cpu },
  { label: 'RAG Pipeline', status: 'not configured', icon: Zap },
];

const statusColor = {
  operational: 'green',
  connected: 'green',
  'not configured': 'yellow',
  error: 'red',
};

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} index={i} />
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 animate-fade-in-up animate-delay-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-brand-400" />
              <h2 className="text-sm font-semibold text-text-primary">
                Recent Activity
              </h2>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-border-default">
              {recentActivity.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3.5 px-6 py-3.5 hover:bg-white/[0.02] transition-default"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-tertiary/60 flex items-center justify-center shrink-0">
                      <Icon size={16} className={item.iconColor} />
                    </div>
                    <span className="flex-1 text-sm text-text-secondary">
                      {item.text}
                    </span>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {item.time}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>

        {/* System Status */}
        <Card className="animate-fade-in-up animate-delay-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="w-2 h-2 bg-success rounded-full inline-block status-pulse" />
              </div>
              <h2 className="text-sm font-semibold text-text-primary">
                System Status
              </h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {systemComponents.map((comp) => {
              const Icon = comp.icon;
              return (
                <div
                  key={comp.label}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="text-text-muted" />
                    <span className="text-sm text-text-secondary">
                      {comp.label}
                    </span>
                  </div>
                  <Badge color={statusColor[comp.status]} dot>
                    {comp.status}
                  </Badge>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
