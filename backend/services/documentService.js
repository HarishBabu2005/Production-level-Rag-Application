const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');

/**
 * Process an uploaded file: save metadata and extract raw text.
 *
 * @param {Object} file - The multer file object
 * @returns {Object} The saved Document record
 */
async function processUpload(file) {
  // 1. Create the document record with initial metadata
  const doc = new Document({
    originalName: file.originalname,
    storedName: file.filename,
    storagePath: file.path,
    mimeType: file.mimetype,
    fileSize: file.size,
    status: 'uploaded',
  });

  // 2. Extract raw text
  try {
    const rawText = await extractText(file.path, file.mimetype);
    doc.rawText = rawText;

    // If PDF, try to get page count
    if (file.mimetype === 'application/pdf') {
      const pageCount = await getPdfPageCount(file.path);
      doc.pageCount = pageCount;
    }
  } catch (error) {
    console.error(`Text extraction failed for ${file.originalname}:`, error.message);
    doc.textExtractionError = error.message;
    // Document is still saved — extraction failure is non-fatal
  }

  // 3. Persist to MongoDB
  await doc.save();
  return doc;
}

/**
 * Extract raw text from a file based on its MIME type.
 *
 * @param {string} filePath - Absolute path to the file
 * @param {string} mimeType - The file's MIME type
 * @returns {string} Extracted raw text
 */
async function extractText(filePath, mimeType) {
  switch (mimeType) {
    case 'application/pdf':
      return await extractPdfText(filePath);

    case 'text/markdown':
    case 'text/x-markdown':
      return await extractMarkdownText(filePath);

    default:
      throw new Error(`Text extraction not supported for MIME type: ${mimeType}`);
  }
}

/**
 * Extract text from a PDF file.
 */
async function extractPdfText(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text || '';
}

/**
 * Read raw content from a Markdown file.
 */
async function extractMarkdownText(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content;
}

/**
 * Get the page count of a PDF file.
 */
async function getPdfPageCount(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.numpages || null;
}

/**
 * Get all documents, sorted by newest first.
 *
 * @param {Object} options - Query options
 * @param {string} options.search - Search term for document name
 * @returns {Array} List of documents
 */
async function getAllDocuments({ search } = {}) {
  const query = {};

  if (search && search.trim()) {
    query.originalName = { $regex: search.trim(), $options: 'i' };
  }

  const documents = await Document.find(query)
    .sort({ createdAt: -1 })
    .lean({ virtuals: true });

  return documents;
}

/**
 * Get a single document by ID.
 *
 * @param {string} id - MongoDB document ID
 * @returns {Object|null} The document or null
 */
async function getDocumentById(id) {
  const doc = await Document.findById(id).lean({ virtuals: true });
  return doc;
}

/**
 * Delete a document and its stored file.
 *
 * @param {string} id - MongoDB document ID
 * @returns {Object|null} The deleted document or null
 */
async function deleteDocument(id) {
  const doc = await Document.findById(id);
  if (!doc) return null;

  // Remove the physical file
  try {
    if (fs.existsSync(doc.storagePath)) {
      fs.unlinkSync(doc.storagePath);
    }
  } catch (error) {
    console.error(`Failed to delete file ${doc.storagePath}:`, error.message);
  }

  // Remove associated chunks
  const Chunk = require('../models/Chunk');
  await Chunk.deleteMany({ documentId: id });

  await Document.findByIdAndDelete(id);
  return doc;
}

module.exports = {
  processUpload,
  extractText,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
};
