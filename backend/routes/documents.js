const express = require('express');
const router = express.Router();
const multer = require('multer');
const { upload } = require('../middleware/upload');
const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  processDocument,
  getDocumentChunks,
} = require('../controllers/documentController');

/**
 * Multer error handler wrapper.
 * Catches multer-specific errors (file too large, invalid type)
 * and converts them to clean JSON responses.
 */
const handleUpload = (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File is too large. Maximum size is 20 MB.',
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          error: 'Only one file can be uploaded at a time.',
        });
      }
      return res.status(400).json({
        success: false,
        error: `Upload error: ${err.message}`,
      });
    }

    if (err) {
      // Custom file-filter errors
      return res.status(err.statusCode || 400).json({
        success: false,
        error: err.message || 'File upload failed.',
      });
    }

    next();
  });
};

// Routes
router.post('/upload', handleUpload, uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);
router.post('/:id/process', processDocument);
router.get('/:id/chunks', getDocumentChunks);

module.exports = router;
