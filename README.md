# RAG Intelligence Platform

A production-oriented full-stack Retrieval-Augmented Generation (RAG) application built with React, Express, and MongoDB. Designed as a modular foundation for building AI-powered document intelligence systems.

## Tech Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| Frontend  | React 19 + Vite             |
| Styling   | Tailwind CSS v4             |
| Backend   | Node.js + Express 5         |
| Database  | MongoDB (via Mongoose)      |
| Icons     | Lucide React                |

## Project Structure

```
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Sidebar, Header, Layout
│   │   │   ├── ui/             # Button, Card, Badge, Table, MetricCard, EmptyState
│   │   │   └── UploadModal.jsx # Drag & drop document upload modal
│   │   ├── pages/              # Dashboard, Documents, Chat, Evaluation
│   │   ├── services/           # API and document services
│   │   ├── App.jsx             # Root component with routing
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind + design tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                    # Node.js + Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── healthController.js # Health check controller
│   │   └── documentController.js # Document upload and retrieval controller
│   ├── middleware/
│   │   ├── errorHandler.js     # Error handling middleware
│   │   └── upload.js           # Multer configuration for file uploads
│   ├── models/                 
│   │   └── Document.js         # Mongoose Document model
│   ├── routes/
│   │   ├── health.js           # Health check route
│   │   └── documents.js        # Document routes
│   ├── services/               
│   │   └── documentService.js  # File processing and text extraction logic
│   ├── uploads/                # Local storage for uploaded documents
│   ├── server.js               # Express app entry point
│   ├── .env.example            # Environment variable template
│   └── package.json
│
└── README.md
```

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** (optional for this step — server starts without it)

## Getting Started

### 1. Clone the repository

```bash
cd "H:\AI project"
```

### 2. Set up the backend

```bash
cd backend

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend will start at **http://localhost:5000**.

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at **http://localhost:5173**.

### 4. Verify the setup

- **Frontend:** Open [http://localhost:5173](http://localhost:5173) in your browser
- **Health Check:** Visit [http://localhost:5000/api/health](http://localhost:5000/api/health)

## API Endpoints

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| GET    | `/api/health`                  | Server health check & DB status |
| POST   | `/api/documents/upload`        | Upload PDF/Markdown & extract text |
| GET    | `/api/documents`               | List all uploaded documents     |
| GET    | `/api/documents/:id`           | Get specific document details   |
| DELETE | `/api/documents/:id`           | Delete a document               |
| POST   | `/api/documents/:id/process`   | Chunk raw text into overlapping chunks |
| GET    | `/api/documents/:id/chunks`    | Retrieve all chunks for a document |

## Environment Variables

| Variable      | Description              | Default                                    |
| ------------- | ------------------------ | ------------------------------------------ |
| `PORT`        | Backend server port      | `5000`                                     |
| `NODE_ENV`    | Environment mode         | `development`                              |
| `MONGODB_URI` | MongoDB connection URI   | `mongodb://localhost:27017/rag-intelligence`|
| `CORS_ORIGIN` | Allowed CORS origin      | `http://localhost:5173`                     |

## Pages

| Page       | Route          | Description                                  |
| ---------- | -------------- | -------------------------------------------- |
| Dashboard  | `/`            | System overview, metrics, activity, status    |
| Documents  | `/documents`   | Document management with upload & search      |
| Chat       | `/chat`        | Chat interface for document Q&A               |
| Evaluation | `/evaluation`  | RAG pipeline performance metrics              |

## Chunking Architecture

This system uses token-aware chunking (`js-tiktoken`) with overlapping to prepare documents for embeddings.

- **Target Chunk Size**: ~700 tokens
- **Chunk Overlap**: ~100 tokens

Why chunking? Large language models and embedding models have fixed context windows. Dividing documents into smaller chunks ensures we only fetch relevant semantic parts during RAG retrieval. Overlap prevents context loss between chunk boundaries.

## Roadmap

This is the foundation layer. Upcoming steps:

- [x] Document upload & processing
- [x] Text extraction & chunking
- [ ] Embedding generation & vector storage
- [ ] RAG retrieval pipeline
- [ ] Chat with citations
- [ ] Evaluation framework (RAGAS metrics)
- [ ] BM25 + semantic hybrid search
- [ ] Reranking

## License

ISC
