# Customization Guide

Customize your IoT dashboard to match your specific needs.

---

## 🎨 UI Customization

### Change Dashboard Colors

Edit `public/style.css`:

```css
:root {
    --primary-color: #0066cc;      /* Change this */
    --secondary-color: #00a8e8;    /* Change this */
    --success-color: #06a77d;      /* Change this */
    --warning-color: #f77f00;      /* Change this */
    --danger-color: #d62828;       /* Change this */
    --dark-bg: #0a0e27;            /* Change this */
}
```

### Change Dashboard Title

Edit `public/index.html`:

```html
<h1>🚀 Your Custom Title Here</h1>
<p class="subtitle">Your custom subtitle</p>
```

### Add Custom Logo

```html
<img src="your-logo.png" alt="Logo" style="height: 50px;">
```

### Change Card Icons

Edit `public/index.html`:

```html
<span class="card-icon">🌡️</span>  <!-- Change emoji -->
```

Available emojis:
- Temperature: 🌡️ 🔥 ♨️
- Humidity: 💧 💦 🌧️
- Battery: 🔋 ⚡ 🔌
- Threshold: ⚙️ 🎚️ 📊
- Status: 🚨 ⚠️ ✅

---

## 📊 Chart Customization

### Change Chart Colors

Edit `public/script.js`:

```javascript
// Temperature Chart
borderColor: '#ff8c00',           // Change this
backgroundColor: 'rgba(255, 140, 0, 0.1)',  // Change this

// Humidity Chart
borderColor: '#00d4ff',           // Change this
backgroundColor: 'rgba(0, 212, 255, 0.1)',  // Change this
```

### Change Chart Type

```javascript
// Change from 'line' to 'bar'
type: 'bar',

// Or use 'area'
type: 'line',
fill: true,
```

### Add More Data Points

```javascript
// In updateCharts function
const displayData = data.slice(-100);  // Show last 100 instead of 50
```

### Change Chart Refresh Rate

Edit `public/script.js`:

```javascript
const REFRESH_INTERVAL = 2000;  // Change to 5000 for 5 seconds
```

---

## 🔌 Sensor Customization

### Add New Sensor

Edit `ARDUINO_CODE.ino`:

```cpp
// Add new pin
const int PRESSURE_SENSOR_PIN = A3;

// Add reading function
float readPressure() {
  int rawValue = analogRead(PRESSURE_SENSOR_PIN);
  float pressure = (rawValue / 1023.0) * 100.0;
  return pressure;
}

// Add to JSON payload
jsonPayload += "\"pressure\":" + String(pressure, 2) + ",";
```

Edit `server.js`:

```javascript
// Add to validation
if (pressure === undefined) {
  return res.status(400).json({
    success: false,
    message: 'Missing pressure field'
  });
}

// Add to database insert
const query = `
  INSERT INTO sensor_readings 
  (temperature, humidity, threshold_value, battery_percentage, 
   battery_status, event_status, pressure)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;
```

### Change Sensor Calibration

Edit `ARDUINO_CODE.ino`:

```cpp
// Adjust these values
const float TEMP_OFFSET = 0.0;        // Add offset
const float TEMP_SCALE = 0.1;         // Multiply by scale
const float HUMIDITY_OFFSET = 0.0;
const float HUMIDITY_SCALE = 0.1;
```

### Change Send Interval

Edit `ARDUINO_CODE.ino`:

```cpp
const unsigned long SEND_INTERVAL = 10000;  // 10 seconds instead of 5
```

---

## 💾 Database Customization

### Add New Table

Edit `schema.sql`:

```sql
CREATE TABLE sensor_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sensor_reading_id INT,
  alert_type VARCHAR(50),
  alert_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sensor_reading_id) REFERENCES sensor_readings(id)
);
```

### Add New Column

```sql
ALTER TABLE sensor_readings 
ADD COLUMN pressure DECIMAL(5,2);

ALTER TABLE sensor_readings 
ADD COLUMN location VARCHAR(100);
```

### Create Index for Performance

```sql
CREATE INDEX idx_temperature ON sensor_readings(temperature);
CREATE INDEX idx_battery ON sensor_readings(battery_percentage);
```

---

## 🔧 Backend Customization

### Add New API Endpoint

Edit `server.js`:

```javascript
// GET /api/average - Get average values
app.get('/api/average', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT 
        AVG(temperature) as avg_temp,
        AVG(humidity) as avg_humidity,
        AVG(battery_percentage) as avg_battery
      FROM sensor_readings
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    `;
    
    const [rows] = await connection.execute(query);
    connection.release();
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching averages',
      error: error.message
    });
  }
});
```

### Add Data Validation

```javascript
// Add to POST /api/sensor-data
if (temperature < -50 || temperature > 150) {
  return res.status(400).json({
    success: false,
    message: 'Temperature out of valid range (-50 to 150°C)'
  });
}

if (humidity < 0 || humidity > 100) {
  return res.status(400).json({
    success: false,
    message: 'Humidity must be between 0 and 100%'
  });
}
```

### Add Data Transformation

```javascript
// Convert Fahrenheit to Celsius
const temperatureCelsius = (temperature - 32) * 5/9;

// Round to 2 decimal places
const roundedTemp = Math.round(temperatureCelsius * 100) / 100;
```

---

## 📱 Frontend Customization

### Add New Dashboard Card

Edit `public/index.html`:

```html
<!-- Add new card -->
<div class="card pressure-card">
    <div class="card-header">
        <h3>Pressure</h3>
        <span class="card-icon">🌡️</span>
    </div>
    <div class="card-value">
        <span id="pressure-value" class="value">--</span>
        <span class="unit">hPa</span>
    </div>
    <div class="card-footer">
        <small id="pressure-time">Last: --</small>
    </div>
</div>
```

Edit `public/script.js`:

```javascript
// Add to updateLiveCards function
document.getElementById('pressure-value').textContent = data.pressure.toFixed(1);
document.getElementById('pressure-time').textContent = `Last: ${formatTime(data.created_at)}`;
```

### Add New Chart

```html
<!-- Add to charts section -->
<div class="chart-container">
    <h3>Pressure Trend</h3>
    <canvas id="pressureChart"></canvas>
</div>
```

```javascript
// Initialize in initializeCharts()
const pressureCtx = document.getElementById('pressureChart').getContext('2d');
pressureChart = new Chart(pressureCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Pressure (hPa)',
      data: [],
      borderColor: '#9966ff',
      backgroundColor: 'rgba(153, 102, 255, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  },
  options: chartOptions
});
```

### Change Refresh Rate

Edit `public/script.js`:

```javascript
const REFRESH_INTERVAL = 5000;  // 5 seconds instead of 2
```

---

## 🎯 Feature Customization

### Add Alerts

Edit `server.js`:

```javascript
// Add alert logic
if (temperature > 35) {
  // Send alert
  console.log('⚠️ High temperature alert!');
  // Could send email, SMS, etc.
}
```

### Add Data Export

```javascript
app.get('/api/export/csv', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM sensor_readings ORDER BY created_at DESC LIMIT 1000'
    );
    connection.release();
    
    // Convert to CSV
    let csv = 'Temperature,Humidity,Battery,Timestamp\n';
    rows.forEach(row => {
      csv += `${row.temperature},${row.humidity},${row.battery_percentage},${row.created_at}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Add Email Alerts

```bash
npm install nodemailer
```

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

// Send alert
if (temperature > 40) {
  transporter.sendMail({
    from: 'your-email@gmail.com',
    to: 'alert@example.com',
    subject: 'High Temperature Alert!',
    text: `Temperature is ${temperature}°C`
  });
}
```

---

## 🔐 Security Customization

### Add Authentication

```bash
npm install jsonwebtoken bcryptjs
```

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Verify credentials
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, 'secret-key', { expiresIn: '24h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ success: false });
  
  jwt.verify(token, 'secret-key', (err, decoded) => {
    if (err) return res.status(401).json({ success: false });
    next();
  });
};

// Protect endpoints
app.get('/api/latest', verifyToken, async (req, res) => {
  // ... existing code
});
```

---

## 📈 Performance Customization

### Optimize Database Queries

```javascript
// Add pagination
app.get('/api/history', async (req, res) => {
  const page = req.query.page || 1;
  const limit = 50;
  const offset = (page - 1) * limit;
  
  const query = `
    SELECT * FROM sensor_readings 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?
  `;
  
  const [rows] = await connection.execute(query, [limit, offset]);
  res.json({ success: true, data: rows, page });
});
```

### Add Caching

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

app.get('/api/latest', async (req, res) => {
  // Check cache first
  const cached = await client.get('latest_reading');
  if (cached) {
    return res.json({ success: true, data: JSON.parse(cached) });
  }
  
  // Fetch from database
  const [rows] = await connection.execute('SELECT * FROM sensor_readings LIMIT 1');
  
  // Cache for 5 seconds
  await client.setex('latest_reading', 5, JSON.stringify(rows[0]));
  
  res.json({ success: true, data: rows[0] });
});
```

---

## 🎨 Theme Customization

### Create Dark Theme (Default)

Already implemented in `style.css`

### Create Light Theme

```css
:root {
    --primary-color: #0066cc;
    --dark-bg: #ffffff;
    --card-bg: #f5f5f5;
    --border-color: #e0e0e0;
    --text-primary: #333333;
    --text-secondary: #666666;
}
```

### Create Custom Theme

```css
/* Cyberpunk Theme */
:root {
    --primary-color: #ff006e;
    --secondary-color: #00f5ff;
    --dark-bg: #0a0e27;
    --card-bg: #1a1f3a;
    --accent-blue: #00f5ff;
    --accent-green: #39ff14;
}
```

---

## 🔄 Workflow Customization

### Add Data Processing

```javascript
// Calculate moving average
function calculateMovingAverage(data, window = 5) {
  return data.map((val, idx) => {
    const start = Math.max(0, idx - window);
    const subset = data.slice(start, idx + 1);
    return subset.reduce((a, b) => a + b) / subset.length;
  });
}
```

### Add Anomaly Detection

```javascript
// Detect outliers
function detectAnomalies(data, threshold = 2) {
  const mean = data.reduce((a, b) => a + b) / data.length;
  const std = Math.sqrt(
    data.reduce((sq, n) => sq + Math.pow(n - mean, 2)) / data.length
  );
  
  return data.map(val => Math.abs(val - mean) > threshold * std);
}
```

---

## 📚 Documentation Customization

### Update README

Edit `README.md` with your specific details:
- Your project name
- Your contact information
- Your custom features
- Your deployment details

### Add Custom Guides

Create new markdown files:
- `SENSOR_CALIBRATION.md`
- `TROUBLESHOOTING_ADVANCED.md`
- `API_EXAMPLES.md`

---

## 🎯 Common Customizations

### Change Units

```javascript
// Fahrenheit instead of Celsius
const tempF = (tempC * 9/5) + 32;

// PSI instead of hPa
const psi = pressure * 0.0145038;
```

### Change Time Format

```javascript
// 24-hour format
const time = date.toLocaleTimeString('en-GB');

// ISO format
const iso = date.toISOString();
```

### Change Number Format

```javascript
// 2 decimal places
value.toFixed(2)

// Thousands separator
value.toLocaleString()

// Scientific notation
value.toExponential(2)
```

---

## ✅ Customization Checklist

- [ ] Colors changed to match brand
- [ ] Title and subtitle updated
- [ ] Icons customized
- [ ] New sensors added (if needed)
- [ ] Database schema updated
- [ ] API endpoints customized
- [ ] Frontend cards updated
- [ ] Charts configured
- [ ] Alerts implemented
- [ ] Security enhanced
- [ ] Performance optimized
- [ ] Documentation updated

---

## 🚀 Next Steps

1. Choose customizations you want
2. Follow the examples above
3. Test thoroughly
4. Update documentation
5. Deploy changes

---

**Happy customizing! 🎨**
