/*
  Blynk to Dashboard Sync
  Reads data from Blynk and stores in MySQL database
*/

const axios = require('axios');
const pool = require('./db');
const { analyzeTemperature } = require('./ai-analyzer');

const BLYNK_AUTH_TOKEN = 'Mqg3EWzG_Z-jEQm2thIbFtJ6kkuetb8n';
const BLYNK_API_URL = 'https://blynk.cloud/external/api/get';

// Virtual pins mapping
const PINS = {
  temperature: 'V0',
  humidity: 'V1',
  threshold: 'V2',
  battery: 'V3',
  batteryStatus: 'V4',
  eventStatus: 'V5'
};

async function syncFromBlynk() {
  try {
    console.log('[Blynk Sync] Fetching data from Blynk...');

    // Fetch all virtual pin values
    const data = {};
    
    for (const [key, pin] of Object.entries(PINS)) {
      try {
        const response = await axios.get(
          `${BLYNK_API_URL}?token=${BLYNK_AUTH_TOKEN}&pin=${pin}`,
          { timeout: 5000 }
        );
        data[key] = response.data;
      } catch (error) {
        console.log(`  ✗ Failed to fetch ${key} (${pin})`);
      }
    }

    console.log('Data from Blynk:', data);

    // Validate data
    if (!data.temperature || !data.humidity || !data.threshold || data.battery === undefined) {
      console.log('[Blynk Sync] Incomplete data, skipping...');
      return;
    }

    // Insert into database
    const connection = await pool.getConnection();
    const query = `
      INSERT INTO sensor_readings 
      (temperature, humidity, threshold_value, battery_percentage, battery_status, event_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(query, [
      parseFloat(data.temperature),
      parseFloat(data.humidity),
      parseFloat(data.threshold),
      parseFloat(data.battery),
      data.batteryStatus || 'UNKNOWN',
      data.eventStatus || 'NORMAL'
    ]);

    connection.release();

    console.log(`✓ [Blynk Sync] Data synced successfully!`);
    console.log(`  Temp: ${data.temperature}°C, Humidity: ${data.humidity}%, Battery: ${data.battery}%`);

    // Analyze temperature with AI
    const analysis = await analyzeTemperature(data.temperature, data.humidity);
    if (analysis) {
      console.log('🤖 [AI Analysis] Status:', analysis.status);
      console.log('   AC Recommendation:', analysis.ac_recommendation?.substring(0, 80) + '...');
    }

  } catch (error) {
    console.error('[Blynk Sync] Error:', error.message);
  }
}

// Run sync every 5 seconds
console.log('Starting Blynk to Dashboard sync...');
console.log('Syncing every 5 seconds\n');

setInterval(syncFromBlynk, 5000);

// Initial sync
syncFromBlynk();
