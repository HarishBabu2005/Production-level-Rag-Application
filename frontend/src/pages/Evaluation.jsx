import {
  ShieldCheck,
  Layers,
  MessageCircle,
  Gauge,
  FlaskConical,
  BarChart3,
} from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

const evaluationMetrics = [
  {
    label: 'Faithfulness',
    value: '—',
    icon: ShieldCheck,
    iconColor: 'text-success',
    iconBg: 'bg-success/10',
  },
  {
    label: 'Context Relevance',
    value: '—',
    icon: Layers,
    iconColor: 'text-brand-400',
    iconBg: 'bg-brand-500/10',
  },
  {
    label: 'Answer Relevance',
    value: '—',
    icon: MessageCircle,
    iconColor: 'text-accent-400',
    iconBg: 'bg-accent-500/10',
  },
  {
    label: 'Retrieval Performance',
    value: '—',
    icon: Gauge,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
  },
];

export default function Evaluation() {
  return (
    <div className="space-y-8">
      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {evaluationMetrics.map((m, i) => (
          <MetricCard key={m.label} {...m} index={i} />
        ))}
      </div>

      {/* Evaluation details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up animate-delay-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-accent-400" />
              <h2 className="text-sm font-semibold text-text-primary">
                Evaluation Runs
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            <EmptyState
              icon={FlaskConical}
              title="No evaluations yet"
              description="Run your first evaluation after setting up the RAG pipeline and processing queries. Evaluation metrics will help you measure and improve retrieval quality."
            />
          </CardBody>
        </Card>

        <Card className="animate-fade-in-up animate-delay-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-brand-400" />
              <h2 className="text-sm font-semibold text-text-primary">
                Performance Trends
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            <EmptyState
              icon={BarChart3}
              title="No performance data"
              description="Performance trends will be displayed here once you run multiple evaluations. Track improvements over time as you optimize your RAG pipeline."
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
