const { encodingForModel } = require('js-tiktoken');
const Document = require('../models/Document');
const Chunk = require('../models/Chunk');

// Configuration
const CHUNK_SIZE = 700; // Target chunk size in tokens
const CHUNK_OVERLAP = 100; // Overlap size in tokens

/**
 * Splits text into overlapping token-aware chunks.
 * Uses cl100k_base encoding (default for newer OpenAI models like text-embedding-ada-002, gpt-3.5, gpt-4).
 *
 * @param {string} text - The raw text to chunk
 * @param {number} chunkSize - Max tokens per chunk
 * @param {number} chunkOverlap - Overlap tokens between chunks
 * @returns {Array} Array of chunk strings
 */
function createTokenChunks(text, chunkSize = CHUNK_SIZE, chunkOverlap = CHUNK_OVERLAP) {
  if (!text || text.trim() === '') return [];

  const encoder = encodingForModel('text-embedding-3-small'); // Uses cl100k_base
  const tokens = encoder.encode(text);
  const chunks = [];

  let i = 0;
  while (i < tokens.length) {
    const end = Math.min(i + chunkSize, tokens.length);
    const chunkTokens = tokens.slice(i, end);
    const chunkText = encoder.decode(chunkTokens);
    
    chunks.push({
      text: chunkText,
      tokenCount: chunkTokens.length,
      startPosition: i,
      endPosition: end
    });

    // Move forward by chunkSize - chunkOverlap
    // If we've reached the end, break
    if (end === tokens.length) break;
    i += (chunkSize - chunkOverlap);
  }

  return chunks;
}

/**
 * Process a document by chunking its raw text.
 *
 * @param {string} documentId - MongoDB ID of the document
 * @returns {Object} Processing statistics
 */
async function processDocument(documentId) {
  const document = await Document.findById(documentId);
  if (!document) {
    throw new Error('Document not found');
  }

  if (!document.rawText) {
    document.status = 'error';
    document.textExtractionError = 'No raw text available for chunking. The file might be empty or extraction failed.';
    await document.save();
    throw new Error(document.textExtractionError);
  }

  // Update status to processing
  document.status = 'processing';
  await document.save();

  try {
    // 1. Duplicate/reprocessing protection: delete existing chunks for this document
    await Chunk.deleteMany({ documentId: document._id });

    // 2. Token-aware chunking
    const chunkObjects = createTokenChunks(document.rawText, CHUNK_SIZE, CHUNK_OVERLAP);
    
    if (chunkObjects.length === 0) {
       throw new Error('No chunks generated. Document text might be completely empty or invalid.');
    }

    // 3. Prepare chunk documents for insertion
    const chunksToInsert = chunkObjects.map((chunk, index) => ({
      documentId: document._id,
      chunkIndex: index,
      text: chunk.text,
      tokenCount: chunk.tokenCount,
      startPosition: chunk.startPosition,
      endPosition: chunk.endPosition,
      metadata: {
        originalName: document.originalName,
        fileType: document.fileType
      }
    }));

    // 4. Store chunks in MongoDB (bulk insert for efficiency)
    await Chunk.insertMany(chunksToInsert);

    // 5. Update document status
    document.status = 'processed';
    document.textExtractionError = null;
    await document.save();

    return {
      documentId: document._id,
      status: 'processed',
      totalChunks: chunksToInsert.length,
      averageTokensPerChunk: Math.round(chunksToInsert.reduce((sum, c) => sum + c.tokenCount, 0) / chunksToInsert.length)
    };

  } catch (error) {
    // Revert status on failure
    document.status = 'error';
    document.textExtractionError = `Chunking failed: ${error.message}`;
    await document.save();
    console.error(`Chunking error for document ${documentId}:`, error);
    throw new Error(`Chunking failed: ${error.message}`);
  }
}

/**
 * Get chunks for a specific document.
 *
 * @param {string} documentId - MongoDB ID of the document
 * @returns {Array} List of chunks sorted by index
 */
async function getChunksForDocument(documentId) {
  const chunks = await Chunk.find({ documentId }).sort({ chunkIndex: 1 }).lean();
  return chunks;
}

module.exports = {
  createTokenChunks,
  processDocument,
  getChunksForDocument,
  CHUNK_SIZE,
  CHUNK_OVERLAP
};
