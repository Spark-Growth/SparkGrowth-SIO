# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a social media analytics dashboard project with two main components:

- **Frontend**: React application built with Create React App located in `slynd_sio_w6/`
- **Backend**: FastAPI Python service located in `slynd_sio_w6/backend/`

The project also contains legacy weekly iterations (`week_1/`, `week_2/`, etc.) that have been cleaned up from the repository.

## Development Commands

### Frontend (React)
Navigate to `slynd_sio_w6/` directory first:

```bash
cd slynd_sio_w6/
npm start          # Start development server (localhost:3000)
npm test           # Run tests in watch mode
npm run build      # Build for production
```

### Backend (FastAPI)
Navigate to `slynd_sio_w6/backend/` directory first:

```bash
cd slynd_sio_w6/backend/
pip install -r requirements.txt    # Install dependencies
uvicorn main:app --reload          # Start development server (localhost:8000)
```

## Architecture Overview

### Frontend Architecture
- **Main App**: Single-page React application with Material-UI components
- **Core Component**: `AnalyticsDashboard.js` - handles file upload, data analysis, and results display
- **Key Features**:
  - CSV file upload via drag & drop
  - Predefined analysis categories (Awareness & Reach, Engagement & Interest, Conversions & Action)
  - Real-time analysis results with structured data visualization
  - Follow-up question functionality

### Backend Architecture
- **FastAPI Application**: RESTful API with CORS middleware
- **LangChain Integration**: Uses pandas dataframe agent with OpenAI GPT-4 for data analysis
- **Key Endpoints**:
  - `/upload` - CSV file processing
  - `/analyze` - Data analysis using LangChain agent
  - `/generate-summary` - Category-level summary generation
  - `/follow-up` - Handle follow-up questions
  - `/generate-category-summary` - Generate comprehensive category summaries

### Data Flow
1. CSV upload → pandas DataFrame → LangChain agent initialization
2. Analysis requests → structured prompts → GPT-4 processing → JSON formatted results
3. Results parsed and displayed with interactive tables and visualizations

## Key Dependencies

### Frontend
- **React 19.0.0** with Material-UI components
- **Papa Parse** for CSV parsing
- **React Dropzone** for file uploads

### Backend
- **FastAPI** with uvicorn server
- **LangChain** with OpenAI integration
- **Pandas** for data manipulation
- **python-dotenv** for environment variables

## Environment Configuration

Backend requires `OPENAI_API_KEY` environment variable. The API base URL is configurable via `REACT_APP_API_BASE_URL` (defaults to `https://slynd-sio-w6.onrender.com`).

## Testing

Frontend uses Jest/React Testing Library (standard Create React App setup). No specific backend tests are currently implemented.