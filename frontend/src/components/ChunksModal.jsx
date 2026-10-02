import { useState, useEffect } from 'react';
import { X, Layers, AlertCircle, Loader2 } from 'lucide-react';
import { getDocumentChunks } from '../services/documentService';
import Button from './ui/Button';

export default function ChunksModal({ isOpen, onClose, document }) {
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && document) {
      fetchChunks();
    }
  }, [isOpen, document]);

  const fetchChunks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDocumentChunks(document._id);
      setChunks(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load chunks');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 glass rounded-2xl shadow-elevated animate-fade-in-up max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-tertiary flex items-center justify-center shrink-0">
              <Layers size={16} className="text-brand-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Document Chunks
              </h2>
              <p className="text-xs text-text-muted mt-0.5 truncate max-w-sm">
                {document?.originalName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-default cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-error/10 border border-error/20">
              <AlertCircle size={16} className="text-error shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 size={24} className="text-brand-400 animate-spin" />
              <p className="text-sm text-text-muted">Loading chunks...</p>
            </div>
          ) : chunks.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-surface-tertiary flex items-center justify-center mb-4">
                <Layers size={20} className="text-text-muted" />
              </div>
              <p className="text-sm text-text-primary font-medium">No chunks found</p>
              <p className="text-xs text-text-muted mt-1 text-center max-w-sm">
                This document has not been processed yet or the chunking process failed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-text-secondary pb-2 border-b border-border-default/50">
                <span>Total Chunks: <strong className="text-text-primary">{chunks.length}</strong></span>
                <span>Average tokens: <strong className="text-text-primary">
                  {Math.round(chunks.reduce((sum, c) => sum + c.tokenCount, 0) / (chunks.length || 1))}
                </strong></span>
              </div>
              
              <div className="space-y-3">
                {chunks.map((chunk) => (
                  <div key={chunk._id} className="p-4 rounded-xl border border-border-default bg-surface-tertiary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
                        Chunk #{chunk.chunkIndex}
                      </span>
                      <span className="text-xs text-text-muted">
                        {chunk.tokenCount} tokens
                      </span>
                    </div>
                    <p className="text-sm text-text-primary/90 whitespace-pre-wrap font-mono leading-relaxed bg-surface-tertiary/50 p-3 rounded-lg border border-border-default/30 max-h-60 overflow-y-auto custom-scrollbar">
                      {chunk.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-border-default shrink-0">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
