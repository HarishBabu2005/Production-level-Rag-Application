const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowed MIME types
const ALLOWED_TYPES = [
  'application/pdf',
  'text/markdown',
  'text/x-markdown',
];

// Map common extensions to MIME types (for when the OS reports generic types)
const EXTENSION_MIME_MAP = {
  '.pdf': 'application/pdf',
  '.md': 'text/markdown',
  '.markdown': 'text/markdown',
};

// Max file size: 20 MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate a unique stored name to prevent collisions
    const uniqueSuffix = crypto.randomBytes(12).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mappedMime = EXTENSION_MIME_MAP[ext];

  if (ALLOWED_TYPES.includes(file.mimetype) || mappedMime) {
    // Override mimetype if it's a known extension but the OS sent a generic type
    if (mappedMime && !ALLOWED_TYPES.includes(file.mimetype)) {
      file.mimetype = mappedMime;
    }
    cb(null, true);
  } else {
    const error = new Error(
      `Unsupported file type: ${file.originalname}. Only PDF and Markdown files are allowed.`
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

module.exports = { upload, UPLOAD_DIR, ALLOWED_TYPES, MAX_FILE_SIZE };
