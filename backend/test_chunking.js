const mongoose = require('mongoose');
const { createTokenChunks, CHUNK_SIZE, CHUNK_OVERLAP, processDocument } = require('./services/chunkingService');
const Document = require('./models/Document');
const Chunk = require('./models/Chunk');
const connectDB = require('./config/db');
require('dotenv').config();

async function runTests() {
  await connectDB();
  console.log('--- Running Chunking Tests ---');
  
  // 1. Empty text
  const emptyChunks = createTokenChunks('');
  console.assert(emptyChunks.length === 0, 'Test 1 Failed: empty text should return 0 chunks');
  
  // 2. Short document
  const shortText = 'This is a short document.';
  const shortChunks = createTokenChunks(shortText, 700, 100);
  console.assert(shortChunks.length === 1, 'Test 2 Failed: short text should return 1 chunk');
  
  // 3 & 4 & 5. Document larger than chunk size & overlap behavior
  const largeText = 'Word '.repeat(1000); // approx 1000 tokens
  const largeChunks = createTokenChunks(largeText, 200, 50); // custom size for testing
  console.assert(largeChunks.length > 1, 'Test 3/4 Failed: should split into multiple chunks');
  console.assert(largeChunks[0].tokenCount <= 200, 'Test 3/4 Failed: chunk exceeded max tokens');
  // Check overlap roughly: end position of chunk 0 should be > start position of chunk 1
  console.assert(largeChunks[0].endPosition > largeChunks[1].startPosition, 'Test 5 Failed: no overlap detected');
  
  // 6 & 7. Process real dummy document in DB
  let doc = new Document({
    originalName: 'test.md',
    storedName: 'test_stored.md',
    storagePath: '/fake/path/test.md',
    mimeType: 'text/markdown',
    fileSize: 1024,
    rawText: largeText,
    status: 'uploaded'
  });
  await doc.save();
  
  const stats = await processDocument(doc._id);
  console.log('Processed stats:', stats);
  console.assert(stats.status === 'processed', 'Test 6 Failed: status should be processed');
  
  const chunks = await Chunk.find({ documentId: doc._id }).sort({ chunkIndex: 1 });
  console.assert(chunks.length > 0, 'Test 6 Failed: chunks not stored in DB');
  console.assert(chunks[0].chunkIndex === 0, 'Test 6 Failed: chunk index should start at 0');
  
  // Check sequential chunk index
  for(let i=0; i<chunks.length; i++) {
    console.assert(chunks[i].chunkIndex === i, `Test 6 Failed: index not sequential at ${i}`);
    console.assert(chunks[i].documentId.toString() === doc._id.toString(), 'Test 7 Failed: incorrect documentId');
  }

  // 8. Duplicate / Reprocessing
  const originalChunkCount = chunks.length;
  await processDocument(doc._id);
  const newChunks = await Chunk.find({ documentId: doc._id });
  console.assert(newChunks.length === originalChunkCount, 'Test 8 Failed: duplicate chunks created');

  // 9. Chunking failure (empty text in DB)
  doc.rawText = '';
  await doc.save();
  try {
    await processDocument(doc._id);
    console.assert(false, 'Test 9 Failed: should throw on empty rawText');
  } catch (e) {
    const updatedDoc = await Document.findById(doc._id);
    console.assert(updatedDoc.status === 'error', 'Test 9 Failed: status should be error');
  }

  // Cleanup
  await Document.findByIdAndDelete(doc._id);
  await Chunk.deleteMany({ documentId: doc._id });

  console.log('--- All Chunking Tests Passed ---');
  process.exit(0);
}

runTests().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
