const mongoose = require('mongoose');
const documentService = require('../services/documentService');
const chunkingService = require('../services/chunkingService');

/**
 * @desc    Upload a document
 * @route   POST /api/documents/upload
 * @access  Public
 */
const uploadDocument = async (req, res, next) => {
  try {
    // multer middleware has already processed the file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided. Please select a PDF or Markdown file to upload.',
      });
    }

    const document = await documentService.processUpload(req.file);

    res.status(201).json({
      success: true,
      message: 'Document uploaded and processed successfully.',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all documents
 * @route   GET /api/documents
 * @access  Public
 */
const getDocuments = async (req, res, next) => {
  try {
    const { search } = req.query;
    const documents = await documentService.getAllDocuments({ search });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single document by ID
 * @route   GET /api/documents/:id
 * @access  Public
 */
const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid document ID format.',
      });
    }

    const document = await documentService.getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a document
 * @route   DELETE /api/documents/:id
 * @access  Public
 */
const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid document ID format.',
      });
    }

    const document = await documentService.deleteDocument(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Process a document (chunking)
 * @route   POST /api/documents/:id/process
 * @access  Public
 */
const processDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid document ID format.',
      });
    }

    const stats = await chunkingService.processDocument(id);

    res.status(200).json({
      success: true,
      message: 'Document processed successfully.',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get chunks for a document
 * @route   GET /api/documents/:id/chunks
 * @access  Public
 */
const getDocumentChunks = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid document ID format.',
      });
    }

    const chunks = await chunkingService.getChunksForDocument(id);

    res.status(200).json({
      success: true,
      count: chunks.length,
      data: chunks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  processDocument,
  getDocumentChunks,
};
