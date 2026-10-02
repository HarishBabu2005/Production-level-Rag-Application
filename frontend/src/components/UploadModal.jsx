import { useState, useRef, useCallback } from 'react';
import {
  X,
  Upload,
  FileText,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from 'lucide-react';
import Button from './ui/Button';

const ALLOWED_EXTENSIONS = ['.pdf', '.md', '.markdown'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'text/markdown', 'text/x-markdown'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const FILE_TYPE_ICONS = {
  'application/pdf': FileText,
  'text/markdown': FileCode,
  'text/x-markdown': FileCode,
};

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(name) {
  return name.slice(name.lastIndexOf('.')).toLowerCase();
}

function validateFile(file) {
  const ext = getFileExtension(file.name);
  const isAllowedType =
    ALLOWED_MIME_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);

  if (!isAllowedType) {
    return 'Unsupported file type. Only PDF and Markdown files are allowed.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File is too large (${formatBytes(file.size)}). Maximum size is 20 MB.`;
  }
  if (file.size === 0) {
    return 'File is empty.';
  }
  return null;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | success | error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setValidationError(null);
    setUploadState('idle');
    setUploadProgress(0);
    setUploadError(null);
    setIsDragging(false);
  }, []);

  const handleClose = () => {
    if (uploadState === 'uploading') return; // prevent closing during upload
    resetState();
    onClose();
  };

  const handleFileSelect = (file) => {
    setUploadError(null);
    setUploadState('idle');

    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      setSelectedFile(null);
      return;
    }

    setValidationError(null);
    setSelectedFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    setUploadState('idle');
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadState('uploading');
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Dynamic import to keep the service layer clean
      const { uploadDocument } = await import('../services/documentService');
      await uploadDocument(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setUploadState('success');

      // Auto-close after a brief success display
      setTimeout(() => {
        resetState();
        onClose();
        onUploadSuccess?.();
      }, 1200);
    } catch (err) {
      setUploadState('error');
      setUploadError(err.message || 'Upload failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  const FileIcon = selectedFile
    ? FILE_TYPE_ICONS[selectedFile.type] || FileText
    : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 glass rounded-2xl shadow-elevated animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <h2 className="text-base font-semibold text-text-primary">
            Upload Document
          </h2>
          <button
            onClick={handleClose}
            disabled={uploadState === 'uploading'}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-default disabled:opacity-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Dropzone (show when no file selected) */}
          {!selectedFile && uploadState === 'idle' && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center py-10 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-default
                ${
                  isDragging
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-border-default hover:border-border-hover hover:bg-white/[0.02]'
                }`}
            >
              <div className="w-12 h-12 rounded-xl bg-surface-tertiary/60 border border-border-default flex items-center justify-center mb-4">
                <Upload size={22} className="text-text-muted" />
              </div>
              <p className="text-sm text-text-primary font-medium mb-1">
                Drag & drop your file here
              </p>
              <p className="text-xs text-text-muted">
                or click to browse — PDF, Markdown — up to 20 MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.md,.markdown"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          )}

          {/* Validation error */}
          {validationError && !selectedFile && (
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-error/10 border border-error/20">
              <AlertCircle size={16} className="text-error shrink-0 mt-0.5" />
              <p className="text-sm text-error">{validationError}</p>
            </div>
          )}

          {/* Selected file preview */}
          {selectedFile && (
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-surface-tertiary/40 border border-border-default">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                <FileIcon size={20} className="text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary font-medium truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted uppercase">
                    {getFileExtension(selectedFile.name).replace('.', '')}
                  </span>
                  <span className="text-xs text-text-muted">•</span>
                  <span className="text-xs text-text-muted">
                    {formatBytes(selectedFile.size)}
                  </span>
                </div>
              </div>
              {uploadState === 'idle' && (
                <button
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-default cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}

          {/* Upload progress */}
          {uploadState === 'uploading' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="text-brand-400 animate-spin" />
                  <span className="text-xs text-text-secondary">
                    Uploading...
                  </span>
                </div>
                <span className="text-xs text-text-muted font-medium">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-surface-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success state */}
          {uploadState === 'success' && (
            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-success/10 border border-success/20">
              <CheckCircle2 size={16} className="text-success shrink-0" />
              <p className="text-sm text-success font-medium">
                Document uploaded and processed successfully!
              </p>
            </div>
          )}

          {/* Error state */}
          {uploadState === 'error' && (
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-error/10 border border-error/20">
              <AlertCircle size={16} className="text-error shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-error font-medium">Upload failed</p>
                <p className="text-xs text-error/80 mt-0.5">{uploadError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-default">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={uploadState === 'uploading'}
          >
            {uploadState === 'success' ? 'Close' : 'Cancel'}
          </Button>
          {uploadState !== 'success' && (
            <Button
              variant="primary"
              size="md"
              icon={uploadState === 'uploading' ? Loader2 : Upload}
              onClick={handleUpload}
              disabled={!selectedFile || uploadState === 'uploading'}
            >
              {uploadState === 'uploading' ? 'Uploading…' : 'Upload'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
