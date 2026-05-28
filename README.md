# Student Analytics Dashboard using ClickHouse

Professional, full-stack analytics platform for exploring student performance data with fast OLAP queries powered by ClickHouse.

---

## Tech Stack

- ClickHouse
- Node.js
- Express.js
- React.js
- Recharts
- Docker
- Axios

---

## Project Overview

This project is a full-stack analytics platform that analyzes student performance data and provides real-time insights through an interactive React dashboard. ClickHouse serves as the analytical database for fast, large-scale queries; a Node.js/Express API layer exposes analytics endpoints and export features; the frontend visualizes results using Recharts.

---

## Features

### Analytics APIs

- Overview
- Gender Analysis
- Race Analysis
- Lunch Analysis
- Test Preparation Analysis
- Parent Education Analysis
- Top Performers
- Score Distribution

### Advanced Features

- Dynamic Filtering
- AI Insights Engine
- Query Performance Monitoring
- CSV Export
- PDF Export
- Dockerized Deployment

---

## Architecture

CSV Dataset
    ↓
ClickHouse Database
    ↓
Node.js / Express API Layer
    ↓
Analytics Services
    ↓
React Dashboard
    ↓
Insights Engine

This flow highlights how raw CSVs are loaded into ClickHouse and served to the dashboard through the backend services and insights engine.

---

## Project Structure

- `backend/` — Express API, ClickHouse client, services, controllers, import scripts
- `frontend/` — Vite + React frontend, components, pages, services
- `docker-compose.yml` — Local development and orchestration

---

## API Endpoints

Analytics

- GET /api/analytics/overview
- GET /api/analytics/gender-analysis
- GET /api/analytics/race-analysis
- GET /api/analytics/lunch-analysis
- GET /api/analytics/test-prep-analysis
- GET /api/analytics/parent-education-analysis
- GET /api/analytics/top-performers
- GET /api/analytics/score-distribution
- GET /api/analytics/insights — AI-generated human-readable insights
- GET /api/analytics/query-performance — query latency and statistics

Export

- GET /api/export/csv — generate and download CSV report
- GET /api/export/pdf — generate and download PDF report

Example: fetch overview from the backend

```bash
curl -s http://localhost:5000/api/analytics/overview | jq .
```

---

## Setup Instructions (Local)

1. Clone the repository

```bash
git clone <repo-url>
cd "New folder"
```

2. Install dependencies (optional when running with Docker; for local development you can install separately)

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

3. Start services with Docker Compose (recommended)

```bash
docker compose up --build
```

4. Open the apps

- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/api/health

Notes:
- The backend expects a ClickHouse database named `student_dashboard` (configured via environment variables in `docker-compose.yml`). If you import data manually, ensure the database and tables exist or run the import script located at `backend/scripts/importData.js`.

---

## Docker Deployment

Use the following command to build and run the full stack with ClickHouse, backend, and frontend:

```bash
docker compose up --build
```

To run detached:

```bash
docker compose up -d --build
```

To stop and remove containers:

```bash
docker compose down
```

---


