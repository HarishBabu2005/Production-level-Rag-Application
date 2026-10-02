const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    storedName: {
      type: String,
      required: [true, 'Stored file name is required'],
    },
    storagePath: {
      type: String,
      required: [true, 'Storage path is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      enum: {
        values: ['application/pdf', 'text/markdown', 'text/x-markdown'],
        message: 'Unsupported file type: {VALUE}',
      },
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File must not be empty'],
    },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'processed', 'error'],
      default: 'uploaded',
    },
    rawText: {
      type: String,
      default: null,
    },
    textExtractionError: {
      type: String,
      default: null,
    },
    pageCount: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual for human-readable file size
documentSchema.virtual('fileSizeFormatted').get(function () {
  const bytes = this.fileSize;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
});

// Virtual for file extension
documentSchema.virtual('fileType').get(function () {
  const ext = this.originalName.split('.').pop().toLowerCase();
  return ext;
});

documentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Document', documentSchema);
