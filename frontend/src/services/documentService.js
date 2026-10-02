import request from './api';

/**
 * Upload a document file.
 *
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Optional progress callback (0-100)
 * @returns {Promise<Object>} The API response
 */
export async function uploadDocument(file, onProgress) {
  const formData = new FormData();
  formData.append('document', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/api/documents/upload');

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          const error = new Error(data.error || 'Upload failed');
          error.status = xhr.status;
          error.data = data;
          reject(error);
        }
      } catch {
        reject(new Error('Failed to parse server response'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    xhr.send(formData);
  });
}

/**
 * Fetch all documents.
 *
 * @param {Object} params - Query parameters
 * @param {string} params.search - Optional search term
 * @returns {Promise<Object>} The API response with documents array
 */
export async function getDocuments({ search } = {}) {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/documents${query}`);
}

/**
 * Fetch a single document by ID.
 *
 * @param {string} id - Document ID
 * @returns {Promise<Object>} The API response with document data
 */
export async function getDocumentById(id) {
  return request(`/documents/${id}`);
}

/**
 * Delete a document by ID.
 *
 * @param {string} id - Document ID
 * @returns {Promise<Object>} The API response
 */
export async function deleteDocumentById(id) {
  return request(`/documents/${id}`, { method: 'DELETE' });
}

/**
 * Trigger processing (chunking) for a document.
 *
 * @param {string} id - Document ID
 * @returns {Promise<Object>} The API response
 */
export async function processDocument(id) {
  return request(`/documents/${id}/process`, { method: 'POST' });
}

/**
 * Fetch chunks for a document.
 *
 * @param {string} id - Document ID
 * @returns {Promise<Object>} The API response with chunks array
 */
export async function getDocumentChunks(id) {
  return request(`/documents/${id}/chunks`);
}
