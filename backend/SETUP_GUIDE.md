# Student Analytics Dashboard - Backend Setup Guide

## Prerequisites

- Node.js (v14+)
- ClickHouse (v22+)
- npm or yarn

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure ClickHouse

Ensure ClickHouse is running on `http://localhost:8123` with:
- **Host**: localhost:8123
- **Username**: default
- **Password**: (empty)

#### Option 1: Using Docker (Recommended)
```bash
docker run -d \
  --name clickhouse \
  -p 8123:8123 \
  -p 9000:9000 \
  clickhouse/clickhouse-server:latest
```

#### Option 2: Manual Installation
Download from: https://clickhouse.com/docs/en/getting-started/install

### 3. Import Data

Once ClickHouse is running:
```bash
node scripts/importData.js
```

This will:
- Create the `student_dashboard` database
- Create the `performance` table
- Import data from `StudentsPerformance.csv`

### 4. Start the Backend Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
node server.js
```

The server will run on `http://localhost:5000`

## API Endpoints

All endpoints return JSON with the format:
```json
{
  "success": true,
  "data": [...]
}
```

### 1. Dashboard Overview
**GET** `/dashboard/overview`

Returns total students, average scores, and test prep completion count.

### 2. Gender Analysis
**GET** `/dashboard/gender-analysis`

Average scores grouped by gender.

### 3. Race/Ethnicity Analysis
**GET** `/dashboard/race-analysis`

Average scores grouped by race/ethnicity.

### 4. Test Preparation Analysis
**GET** `/dashboard/test-prep-analysis`

Score comparison based on test prep course completion.

### 5. Parent Education Analysis
**GET** `/dashboard/parent-education-analysis`

Student performance grouped by parental education level.

### 6. Top Performers
**GET** `/dashboard/top-performers`

Top 10 students based on combined scores.

### 7. Score Distribution
**GET** `/dashboard/score-distribution`

Students grouped by score ranges (90-100, 80-89, etc.).

### 8. Lunch Type Analysis
**GET** `/dashboard/lunch-analysis`

Student performance grouped by lunch type.

## Testing

### Using Postman
1. Import the API endpoints into Postman
2. Set base URL to `http://localhost:5000`
3. Test each endpoint

### Using Browser
Visit: `http://localhost:5000/dashboard/overview`

### Using curl
```bash
curl http://localhost:5000/dashboard/overview
```

## Database Schema

### Table: `performance`

| Column | Type | Description |
|--------|------|-------------|
| gender | String | Student gender |
| ethnicity | String | Race/ethnicity of student |
| level_of_education | String | Parent's education level |
| lunch | String | Lunch type (standard/free/reduced) |
| preparation_course | String | Test prep course status (completed/none) |
| math_score | Int32 | Math test score (0-100) |
| reading_score | Int32 | Reading test score (0-100) |
| writing_score | Int32 | Writing test score (0-100) |

## Environment Variables (.env)

```
PORT=5000
CLICKHOUSE_HOST=http://localhost:8123
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=
CLICKHOUSE_DATABASE=student_dashboard
```

## Troubleshooting

### Connection Refused
- Ensure ClickHouse is running
- Check the host and port in `.env`

### Authentication Failed
- Verify username and password in `.env`
- For ClickHouse with authentication disabled, password can be empty

### Data Import Issues
- Ensure CSV file path is correct
- Check ClickHouse database permissions
- Verify table schema matches data structure

## Performance Considerations

- ClickHouse is optimized for analytical queries
- Queries use aggregation functions (AVG, COUNT, etc.)
- Results are indexed and cached for faster retrieval
- The backend is designed to handle high-volume dashboards

## Architecture

```
backend/
├── controllers/      # Request handlers
├── routes/          # API route definitions
├── services/        # ClickHouse query logic
├── middleware/      # Error handling
├── scripts/         # Data import utilities
├── clickhouse.js    # ClickHouse client setup
├── server.js        # Express app
├── .env            # Environment variables
└── package.json    # Dependencies
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "student-analytics"
   ```

3. Configure reverse proxy (nginx/Apache)
4. Enable CORS for your frontend domain
5. Add authentication/authorization layer as needed
