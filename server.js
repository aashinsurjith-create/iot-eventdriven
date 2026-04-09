// Main Express server for IoT Dashboard
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// API ENDPOINTS
// ============================================

// POST /api/sensor-data - Receive sensor data from Arduino
app.post('/api/sensor-data', async (req, res) => {
  try {
    console.log('📨 Received POST request to /api/sensor-data');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { temperature, humidity, threshold_value, battery_percentage, battery_status, event_status } = req.body;

    // Validate incoming data
    if (temperature === undefined || humidity === undefined || threshold_value === undefined ||
        battery_percentage === undefined || !battery_status || !event_status) {
      console.log('❌ Validation failed - Missing fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: temperature, humidity, threshold_value, battery_percentage, battery_status, event_status'
      });
    }

    // Validate data types and ranges
    if (isNaN(temperature) || isNaN(humidity) || isNaN(threshold_value) || isNaN(battery_percentage)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data types. All numeric fields must be numbers.'
      });
    }

    if (battery_percentage < 0 || battery_percentage > 100) {
      return res.status(400).json({
        success: false,
        message: 'Battery percentage must be between 0 and 100'
      });
    }

    // Insert data into database
    const connection = await pool.getConnection();
    const query = `
      INSERT INTO sensor_readings 
      (temperature, humidity, threshold_value, battery_percentage, battery_status, event_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      parseFloat(temperature),
      parseFloat(humidity),
      parseFloat(threshold_value),
      parseFloat(battery_percentage),
      battery_status.toUpperCase(),
      event_status.toUpperCase()
    ]);

    connection.release();

    console.log(`✓ Data received - Temp: ${temperature}°C, Humidity: ${humidity}%, Battery: ${battery_percentage}%`);

    res.status(201).json({
      success: true,
      message: 'Sensor data stored successfully',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error storing sensor data:', error);
    res.status(500).json({
      success: false,
      message: 'Error storing sensor data',
      error: error.message
    });
  }
});

// GET /api/latest - Get the latest sensor reading
app.get('/api/latest', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT * FROM sensor_readings 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    if (rows.length === 0) {
      console.log('📊 /api/latest: No data in database');
      return res.status(404).json({
        success: false,
        message: 'No sensor data available yet'
      });
    }

    console.log('📊 /api/latest: Returning data -', rows[0]);
    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest data',
      error: error.message
    });
  }
});

// GET /api/history - Get last 50 sensor readings
app.get('/api/history', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT * FROM sensor_readings 
      ORDER BY created_at DESC 
      LIMIT 50
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    res.json({
      success: true,
      count: rows.length,
      data: rows.reverse() // Reverse to show oldest first for charts
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching history',
      error: error.message
    });
  }
});

// GET /api/stats - Get statistics for the current day
app.get('/api/stats', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT 
        COUNT(*) as total_readings,
        AVG(temperature) as avg_temperature,
        MAX(temperature) as max_temperature,
        MIN(temperature) as min_temperature,
        AVG(humidity) as avg_humidity,
        MAX(humidity) as max_humidity,
        MIN(humidity) as min_humidity,
        AVG(battery_percentage) as avg_battery,
        SUM(CASE WHEN event_status = 'EVENT DETECTED' THEN 1 ELSE 0 END) as event_count
      FROM sensor_readings 
      WHERE DATE(created_at) = CURDATE()
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Serve the main dashboard page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   IoT Dashboard Server Started         ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║ Server running on: http://0.0.0.0:${PORT}  ║`);
  console.log('║ Dashboard: http://localhost:3000       ║');
  console.log('║ API Health: http://localhost:3000/api/health ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  pool.end();
  process.exit(0);
});
