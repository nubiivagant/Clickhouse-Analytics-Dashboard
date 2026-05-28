const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createClient } = require('@clickhouse/client');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const clickhouse = require('../clickhouse');

const initClient = createClient({
  url: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
});

const initDB = async () => {
  try {
    console.log('Creating database if not exists...');
    await initClient.exec({
      query: `CREATE DATABASE IF NOT EXISTS student_dashboard`,
    });

    console.log('Creating performance table if not exists...');
    await clickhouse.exec({
      query: `
        CREATE TABLE IF NOT EXISTS student_dashboard.performance (
          gender String,
          ethnicity String,
          level_of_education String,
          lunch String,
          preparation_course String,
          math_score Int32,
          reading_score Int32,
          writing_score Int32
        ) ENGINE = MergeTree()
        ORDER BY tuple()
      `,
    });
    console.log('Database and table ready.');
  } catch (error) {
    console.error('Error initializing DB:', error);
    process.exit(1);
  }
};

const importData = async () => {
  const results = [];
  const csvFilePath = path.join(__dirname, '..', '..', 'StudentsPerformance.csv');

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      results.push({
        gender: data.gender,
        ethnicity: data['race/ethnicity'],
        level_of_education: data['parental level of education'],
        lunch: data.lunch,
        preparation_course: data['test preparation course'],
        math_score: parseInt(data['math score'], 10),
        reading_score: parseInt(data['reading score'], 10),
        writing_score: parseInt(data['writing score'], 10),
      });
    })
    .on('end', async () => {
      console.log(`Parsed ${results.length} rows from CSV. Inserting...`);
      try {
        await clickhouse.insert({
          table: 'student_dashboard.performance',
          values: results,
          format: 'JSONEachRow',
        });
        console.log('Data imported successfully!');
        process.exit(0);
      } catch (error) {
        console.error('Error inserting data:', error);
        process.exit(1);
      }
    });
};

const run = async () => {
  await initDB();
  
  // check if table is empty
  const resultSet = await clickhouse.query({
    query: 'SELECT COUNT(*) as count FROM student_dashboard.performance',
    format: 'JSONEachRow',
  });
  const data = await resultSet.json();
  
  if (data[0].count > 0) {
    console.log(`Table already has ${data[0].count} records. Skipping import.`);
    process.exit(0);
  } else {
    importData();
  }
};

run();
