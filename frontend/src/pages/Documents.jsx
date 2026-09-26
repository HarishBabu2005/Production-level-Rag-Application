import { useState } from 'react';
import {
  Upload,
  Search,
  Filter,
  FileText,
  FileSpreadsheet,
  FileImage,
  MoreVertical,
} from 'lucide-react';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

const typeIcons = {
  pdf: FileText,
  csv: FileSpreadsheet,
  image: FileImage,
  default: FileText,
};

const statusColors = {
  indexed: 'green',
  processing: 'yellow',
  pending: 'gray',
  error: 'red',
};

const columns = [
  {
    key: 'name',
    label: 'Document Name',
    render: (row) => {
      const Icon = typeIcons[row.type] || typeIcons.default;
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-tertiary flex items-center justify-center shrink-0">
            <Icon size={16} className="text-brand-400" />
          </div>
          <span className="text-text-primary font-medium">{row.name}</span>
        </div>
      );
    },
  },
  {
    key: 'type',
    label: 'Type',
    render: (row) => (
      <span className="uppercase text-xs text-text-muted tracking-wider">
        {row.type}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <Badge color={statusColors[row.status] || 'gray'} dot>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'uploadedAt',
    label: 'Uploaded',
  },
  {
    key: 'actions',
    label: '',
    width: '48px',
    render: () => (
      <button className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-default">
        <MoreVertical size={16} />
      </button>
    ),
  },
];

export default function Documents() {
  const [documents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search documents…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg
                bg-surface-tertiary/50 border border-border-default
                text-text-primary placeholder:text-text-muted
                focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30
                transition-default"
            />
          </div>

          {/* Filter */}
          <Button variant="secondary" size="md" icon={Filter}>
            Filter
          </Button>
        </div>

        {/* Upload button */}
        <Button variant="primary" size="md" icon={Upload}>
          Upload Document
        </Button>
      </div>

      {/* Document table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">
              All Documents
            </h2>
            <span className="text-xs text-text-muted">
              {documents.length} document{documents.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {documents.length > 0 ? (
            <Table columns={columns} data={documents} />
          ) : (
            <EmptyState
              icon={FileText}
              title="No documents uploaded"
              description="Upload your first document to start building your knowledge base. Supported formats include PDF, TXT, CSV, and more."
              action={
                <Button variant="primary" size="md" icon={Upload}>
                  Upload Your First Document
                </Button>
              }
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
