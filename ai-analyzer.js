/*
  AI Temperature Analyzer
  Provides intelligent analysis of temperature and environmental conditions
*/

const pool = require('./db');

let lastAnalysisTime = 0;
const ANALYSIS_INTERVAL = 30000; // Analyze every 30 seconds

function analyzeTemperatureLocally(temperature, humidity) {
  // Get current hour to consider time-based schedule
  const now = new Date();
  const hour = now.getHours();
  
  // Define time-based comfort ranges
  let idealTempMin, idealTempMax;
  let timeOfDay = '';
  
  if (hour >= 6 && hour < 9) {
    // Morning (6-9 AM): Waking up, slightly cooler
    idealTempMin = 20;
    idealTempMax = 24;
    timeOfDay = 'Morning (6-9 AM)';
  } else if (hour >= 9 && hour < 12) {
    // Late morning (9 AM-12 PM): Active hours
    idealTempMin = 21;
    idealTempMax = 25;
    timeOfDay = 'Late Morning (9 AM-12 PM)';
  } else if (hour >= 12 && hour < 14) {
    // Noon (12-2 PM): Lunch time, warmer
    idealTempMin = 22;
    idealTempMax = 26;
    timeOfDay = 'Noon (12-2 PM)';
  } else if (hour >= 14 && hour < 17) {
    // Afternoon (2-5 PM): Peak heat, need cooling
    idealTempMin = 21;
    idealTempMax = 25;
    timeOfDay = 'Afternoon (2-5 PM)';
  } else if (hour >= 17 && hour < 20) {
    // Evening (5-8 PM): Cooling down
    idealTempMin = 20;
    idealTempMax = 24;
    timeOfDay = 'Evening (5-8 PM)';
  } else if (hour >= 20 && hour < 23) {
    // Night (8-11 PM): Preparing for sleep, cooler
    idealTempMin = 18;
    idealTempMax = 22;
    timeOfDay = 'Night (8-11 PM)';
  } else {
    // Late night/Early morning (11 PM-6 AM): Sleep time, coolest
    idealTempMin = 16;
    idealTempMax = 20;
    timeOfDay = 'Late Night (11 PM-6 AM)';
  }

  let acRecommendation = '';
  let environmentalImpact = '';
  let healthImpact = '';
  let status = 'SAFE';

  // AC Recommendation based on temperature and time of day
  if (temperature < idealTempMin - 5) {
    acRecommendation = `${timeOfDay}: Temperature is too cold (${temperature.toFixed(1)}°C). Increase heating to ${idealTempMin}-${idealTempMax}°C for comfort.`;
    status = 'WARNING';
  } else if (temperature < idealTempMin) {
    acRecommendation = `${timeOfDay}: Room is cool. Set AC to ${idealTempMin}-${idealTempMax}°C for optimal comfort.`;
    status = 'SAFE';
  } else if (temperature <= idealTempMax) {
    acRecommendation = `${timeOfDay}: Ideal temperature range. Maintain AC at ${idealTempMin}-${idealTempMax}°C.`;
    status = 'SAFE';
  } else if (temperature < idealTempMax + 5) {
    acRecommendation = `${timeOfDay}: Slightly warm. Set AC to ${idealTempMin}-${idealTempMax}°C for comfort and energy efficiency.`;
    status = 'WARNING';
  } else {
    acRecommendation = `${timeOfDay}: Very hot (${temperature.toFixed(1)}°C). Immediately set AC to ${idealTempMin}-${idealTempMax}°C to maintain comfort and prevent heat stress.`;
    status = 'DANGER';
  }

  // Environmental Impact
  if (temperature < 0) {
    environmentalImpact = 'Extreme cold - potential risk to outdoor ecosystems and infrastructure.';
  } else if (temperature < 15) {
    environmentalImpact = 'Cold conditions - may affect plant growth and animal activity.';
  } else if (temperature < 25) {
    environmentalImpact = 'Moderate temperature - normal environmental conditions.';
  } else if (temperature < 35) {
    environmentalImpact = 'Warm conditions - may increase energy consumption and stress on ecosystems.';
  } else {
    environmentalImpact = 'Extreme heat - significant environmental stress, increased evaporation, and ecosystem strain.';
  }

  // Health Impact
  if (temperature < 0) {
    healthImpact = 'DANGER: Extreme cold risk. Hypothermia possible. Seek immediate shelter and warmth.';
  } else if (temperature < 15) {
    healthImpact = 'Cold conditions. Risk of hypothermia and frostbite. Wear warm clothing.';
  } else if (temperature < 18) {
    healthImpact = 'Cool environment. Generally safe. Wear light layers if needed.';
  } else if (temperature < 26) {
    healthImpact = 'Ideal temperature range. Minimal health risks. Optimal for productivity and comfort.';
  } else if (temperature < 30) {
    healthImpact = 'Warm conditions. Stay hydrated. Risk of heat exhaustion with prolonged exposure.';
  } else if (temperature < 35) {
    healthImpact = 'WARNING: Hot environment. High risk of heat exhaustion and dehydration. Drink water frequently.';
  } else {
    healthImpact = 'DANGER: Extreme heat. Risk of heat stroke. Seek cool environment immediately. Drink water constantly.';
  }

  return {
    ac_recommendation: acRecommendation,
    environmental_impact: environmentalImpact,
    health_impact: healthImpact,
    status: status
  };
}

async function analyzeTemperature(temperature, humidity) {
  try {
    const now = Date.now();
    if (lastAnalysisTime && (now - lastAnalysisTime) < ANALYSIS_INTERVAL) {
      return null;
    }

    console.log('\n🤖 [AI Analyzer] Analyzing temperature: ' + temperature + '°C');

    const analysis = analyzeTemperatureLocally(temperature, humidity);
    
    // Store analysis in database
    await storeAnalysis(temperature, humidity, analysis);

    lastAnalysisTime = now;
    return analysis;

  } catch (error) {
    console.error('🤖 [AI Analyzer] Error:', error.message);
    return null;
  }
}

async function storeAnalysis(temperature, humidity, analysis) {
  try {
    const connection = await pool.getConnection();
    
    // Create table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ai_analysis (
        id INT AUTO_INCREMENT PRIMARY KEY,
        temperature FLOAT,
        humidity FLOAT,
        ac_recommendation TEXT,
        environmental_impact TEXT,
        health_impact TEXT,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const query = `
      INSERT INTO ai_analysis 
      (temperature, humidity, ac_recommendation, environmental_impact, health_impact, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(query, [
      temperature,
      humidity,
      analysis.ac_recommendation || 'N/A',
      analysis.environmental_impact || 'N/A',
      analysis.health_impact || 'N/A',
      analysis.status || 'UNKNOWN'
    ]);

    connection.release();
    console.log('✓ [AI Analyzer] Analysis stored - Status: ' + analysis.status);

  } catch (error) {
    console.error('Error storing analysis:', error.message);
  }
}

async function getLatestAnalysis() {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT * FROM ai_analysis 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    const [rows] = await connection.execute(query);
    connection.release();

    if (rows.length > 0) {
      return rows[0];
    }
    return null;

  } catch (error) {
    console.error('Error fetching analysis:', error.message);
    return null;
  }
}

module.exports = {
  analyzeTemperature,
  getLatestAnalysis
};
