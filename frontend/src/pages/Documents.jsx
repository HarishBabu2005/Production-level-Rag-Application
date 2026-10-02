import { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Search,
  Filter,
  FileText,
  FileCode,
  MoreVertical,
  Trash2,
  Eye,
  RefreshCw,
  Loader2,
  AlertCircle,
  HardDrive,
  Cpu,
  Layers,
} from 'lucide-react';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import UploadModal from '../components/UploadModal';
import ChunksModal from '../components/ChunksModal';
import { getDocuments, deleteDocumentById, processDocument } from '../services/documentService';

const typeIcons = {
  pdf: FileText,
  md: FileCode,
  markdown: FileCode,
  default: FileText,
};

const statusColors = {
  uploaded: 'green',
  processing: 'yellow',
  processed: 'blue',
  error: 'red',
};

function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showChunksModal, setShowChunksModal] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await getDocuments({ search: searchQuery });
      setDocuments(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      await deleteDocumentById(id);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  const handleProcess = async (id) => {
    if (processingId) return;
    setProcessingId(id);
    try {
      await processDocument(id);
      fetchDocuments(); // Refresh to get updated status
    } catch (err) {
      setError(err.message || 'Failed to process document');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewChunks = (doc) => {
    setSelectedDocument(doc);
    setShowChunksModal(true);
  };

  const handleUploadSuccess = () => {
    fetchDocuments();
  };

  const columns = [
    {
      key: 'name',
      label: 'Document Name',
      render: (row) => {
        const ext = row.originalName?.split('.').pop().toLowerCase();
        const Icon = typeIcons[ext] || typeIcons.default;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-tertiary flex items-center justify-center shrink-0">
              <Icon size={16} className="text-brand-400" />
            </div>
            <div className="min-w-0">
              <span className="text-text-primary font-medium block truncate max-w-[260px]">
                {row.originalName}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => {
        const ext = row.originalName?.split('.').pop().toLowerCase();
        return (
          <span className="uppercase text-xs text-text-muted tracking-wider font-medium">
            {ext}
          </span>
        );
      },
    },
    {
      key: 'fileSize',
      label: 'Size',
      render: (row) => (
        <span className="text-xs text-text-secondary">
          {formatBytes(row.fileSize)}
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
      key: 'createdAt',
      label: 'Uploaded',
      render: (row) => (
        <span className="text-xs text-text-secondary">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '120px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          {row.status !== 'error' && (
            <button
              onClick={() => handleProcess(row._id)}
              disabled={processingId === row._id}
              className="p-1.5 rounded-md text-text-muted hover:text-brand-400 hover:bg-brand-500/10 transition-default cursor-pointer disabled:opacity-50"
              title="Process (Chunk) Document"
            >
              {processingId === row._id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Cpu size={14} />
              )}
            </button>
          )}

          {row.status === 'processed' && (
            <button
              onClick={() => handleViewChunks(row)}
              className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-default cursor-pointer"
              title="View Chunks"
            >
              <Layers size={14} />
            </button>
          )}

          <button
            onClick={() => handleDelete(row._id)}
            disabled={deletingId === row._id}
            className="p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/10 transition-default cursor-pointer disabled:opacity-50"
            title="Delete document"
          >
            {deletingId === row._id ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      ),
    },
  ];

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

          {/* Refresh */}
          <Button
            variant="secondary"
            size="md"
            icon={RefreshCw}
            onClick={fetchDocuments}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>

        {/* Upload button */}
        <Button
          variant="primary"
          size="md"
          icon={Upload}
          onClick={() => setShowUploadModal(true)}
        >
          Upload Document
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 p-3.5 rounded-lg bg-error/10 border border-error/20">
          <AlertCircle size={16} className="text-error shrink-0" />
          <p className="text-sm text-error flex-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-error/60 hover:text-error text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Document table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive size={15} className="text-brand-400" />
              <h2 className="text-sm font-semibold text-text-primary">
                All Documents
              </h2>
            </div>
            <span className="text-xs text-text-muted">
              {loading ? '…' : `${documents.length} document${documents.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="text-brand-400 animate-spin" />
            </div>
          ) : documents.length > 0 ? (
            <Table columns={columns} data={documents} />
          ) : (
            <EmptyState
              icon={FileText}
              title="No documents uploaded"
              description="Upload your first document to start building your knowledge base. Supported formats: PDF and Markdown."
              action={
                <Button
                  variant="primary"
                  size="md"
                  icon={Upload}
                  onClick={() => setShowUploadModal(true)}
                >
                  Upload Your First Document
                </Button>
              }
            />
          )}
        </CardBody>
      </Card>

      {/* Upload modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Chunks modal */}
      <ChunksModal
        isOpen={showChunksModal}
        onClose={() => setShowChunksModal(false)}
        document={selectedDocument}
      />
    </div>
  );
}
