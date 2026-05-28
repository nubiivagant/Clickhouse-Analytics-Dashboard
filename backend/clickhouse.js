const { createClient } = require('@clickhouse/client');

const client = createClient({
  url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'admin',
  password: process.env.CLICKHOUSE_PASSWORD || 'admin123',
  database: process.env.CLICKHOUSE_DATABASE || 'student_dashboard',
});

module.exports = client;