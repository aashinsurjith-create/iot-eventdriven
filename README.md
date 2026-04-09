# Arduino IoT Dashboard

A complete real-time IoT monitoring dashboard for Arduino UNO R4 WiFi projects. Displays live sensor data with charts, statistics, and historical records.

## 🎯 Features

- **Live Sensor Display**: Real-time temperature, humidity, threshold, battery status, and event detection
- **Historical Charts**: Track temperature, humidity, battery, and threshold trends over time
- **Data Storage**: MySQL database with timestamped records
- **Auto-Refresh**: Dashboard updates every 2 seconds
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional UI**: Industrial IoT monitoring system appearance
- **REST API**: Easy integration with Arduino and other devices

## 📋 Project Structure

```
arduino-iot-dashboard/
├── server.js              # Express server with API endpoints
├── db.js                  # MySQL database connection
├── package.json           # Node.js dependencies
├── schema.sql             # MySQL database schema
├── README.md              # This file
├── ARDUINO_CODE.ino       # Example Arduino sketch
└── public/
    ├── index.html         # Dashboard HTML
    ├── style.css          # Dashboard styling
    └── script.js          # Dashboard JavaScript
```

## 🛠️ Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/)
- **Arduino UNO R4 WiFi** with WiFiS3 library
- **Git** (optional, for cloning)

## 📦 Installation

### Step 1: Install Node.js Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `mysql2` - MySQL database driver
- `cors` - Cross-Origin Resource Sharing
- `body-parser` - JSON request parsing
- `dotenv` - Environment variables

### Step 2: Set Up MySQL Database

1. **Open MySQL Command Line or MySQL Workbench**

2. **Create the database and table:**

```sql
-- Copy and paste the entire contents of schema.sql
-- Or run from command line:
mysql -u root -p < schema.sql
```

**If you have a MySQL password:**
```bash
mysql -u root -p < schema.sql
```

**Verify the database was created:**
```sql
USE iot_microproject;
SHOW TABLES;
DESCRIBE sensor_readings;
```

### Step 3: Configure Database Connection (Optional)

Edit `db.js` if your MySQL setup is different:

```javascript
const pool = mysql.createPool({
  host: 'localhost',      // Your MySQL host
  user: 'root',           // Your MySQL username
  password: '',           // Your MySQL password (if any)
  database: 'iot_microproject',
  // ... rest of config
});
```

## 🚀 Running the Project

### Start the Backend Server

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   IoT Dashboard Server Started         ║
╠════════════════════════════════════════╣
║ Server running on: http://localhost:3000  ║
║ Dashboard: http://localhost:3000       ║
║ API Health: http://localhost:3000/api/health ║
╚════════════════════════════════════════╝
```

### Access the Dashboard

Open your browser and go to:
```
http://localhost:3000
```

## 📡 API Endpoints

### POST /api/sensor-data
**Receive sensor data from Arduino**

Request body:
```json
{
  "temperature": 30.5,
  "humidity": 61.7,
  "threshold_value": 32.4,
  "battery_percentage": 45.0,
  "battery_status": "MEDIUM",
  "event_status": "NORMAL"
}
```

Response:
```json
{
  "success": true,
  "message": "Sensor data stored successfully",
  "id": 1
}
```

### GET /api/latest
**Get the most recent sensor reading**

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "temperature": 30.5,
    "humidity": 61.7,
    "threshold_value": 32.4,
    "battery_percentage": 45.0,
    "battery_status": "MEDIUM",
    "event_status": "NORMAL",
    "created_at": "2024-01-15T10:30:45.000Z"
  }
}
```

### GET /api/history
**Get last 50 sensor readings**

Response:
```json
{
  "success": true,
  "count": 50,
  "data": [
    { /* sensor reading 1 */ },
    { /* sensor reading 2 */ },
    // ... up to 50 readings
  ]
}
```

### GET /api/stats
**Get today's statistics**

Response:
```json
{
  "success": true,
  "data": {
    "total_readings": 100,
    "avg_temperature": 28.5,
    "max_temperature": 35.2,
    "min_temperature": 22.1,
    "avg_humidity": 55.3,
    "max_humidity": 75.0,
    "min_humidity": 40.0,
    "avg_battery": 65.5,
    "event_count": 3
  }
}
```

### GET /api/health
**Health check endpoint**

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:45.000Z"
}
```

## 🔌 Arduino Integration

### Arduino Code Example

See `ARDUINO_CODE.ino` for a complete example. Here's the key part:

```cpp
#include <WiFiS3.h>
#include <ArduinoHttpClient.h>

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Server details
const char* serverAddress = "192.168.1.100";  // Your computer's IP
const int port = 3000;

WiFiClient wifiClient;
HttpClient client = HttpClient(wifiClient, serverAddress, port);

void sendSensorData(float temp, float humidity, float threshold, 
                    float battery, String batteryStatus, String eventStatus) {
  
  // Create JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"temperature\":" + String(temp) + ",";
  jsonPayload += "\"humidity\":" + String(humidity) + ",";
  jsonPayload += "\"threshold_value\":" + String(threshold) + ",";
  jsonPayload += "\"battery_percentage\":" + String(battery) + ",";
  jsonPayload += "\"battery_status\":\"" + batteryStatus + "\",";
  jsonPayload += "\"event_status\":\"" + eventStatus + "\"";
  jsonPayload += "}";

  // Send POST request
  client.post("/api/sensor-data", "application/json", jsonPayload);
  
  // Get response
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();
  
  Serial.print("Status: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);
}
```

### Finding Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (usually 192.168.x.x)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address

### Arduino Setup Steps

1. Update WiFi credentials in the Arduino code
2. Update the server IP address to your computer's IP
3. Upload the code to Arduino UNO R4 WiFi
4. Open Serial Monitor to verify connection
5. Check the dashboard for incoming data

## 📊 Database Schema

### sensor_readings Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| temperature | DECIMAL(5,2) | Temperature in Celsius |
| humidity | DECIMAL(5,2) | Humidity percentage |
| threshold_value | DECIMAL(5,2) | Threshold value in Celsius |
| battery_percentage | DECIMAL(5,2) | Battery level 0-100% |
| battery_status | VARCHAR(20) | FULL, MEDIUM, or LOW |
| event_status | VARCHAR(20) | NORMAL or EVENT DETECTED |
| created_at | TIMESTAMP | Automatic timestamp |

## 🎨 Dashboard Features

### Live Data Cards
- Temperature with real-time updates
- Humidity percentage
- Threshold value
- Battery percentage
- Battery status (FULL/MEDIUM/LOW)
- Event status (NORMAL/EVENT DETECTED)

### Charts
- Temperature trend over time
- Humidity trend over time
- Battery level trend
- Threshold trend

### Recent Readings Table
- Last 20 sensor readings
- Sortable by timestamp
- Color-coded status indicators

### Statistics
- Total readings today
- Average temperature
- Average humidity
- Event count

## 🔧 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "Connection refused" error
- Make sure MySQL is running
- Check database credentials in `db.js`
- Verify database exists: `mysql -u root -p -e "USE iot_microproject;"`

### Dashboard shows "No data available"
- Check Arduino is sending data correctly
- Verify API endpoint: `http://localhost:3000/api/health`
- Check browser console for errors (F12)
- Verify Arduino IP address matches your computer

### Charts not updating
- Check browser console for JavaScript errors
- Verify data is being stored in database
- Try refreshing the page

### Arduino can't connect to server
- Verify WiFi connection on Arduino
- Check firewall isn't blocking port 3000
- Ensure Arduino and computer are on same network
- Use correct IP address (not localhost)

## 📝 Example Workflow

1. **Start MySQL**
   ```bash
   # Windows
   net start MySQL80
   
   # Mac
   brew services start mysql
   ```

2. **Create Database**
   ```bash
   mysql -u root -p < schema.sql
   ```

3. **Start Backend**
   ```bash
   npm start
   ```

4. **Upload Arduino Code**
   - Update WiFi credentials
   - Update server IP
   - Upload to Arduino UNO R4 WiFi

5. **Open Dashboard**
   - Go to http://localhost:3000
   - Watch real-time data stream in

## 🚀 Performance Tips

- Dashboard auto-refreshes every 2 seconds
- Charts display last 50 readings
- Table shows last 20 readings
- Database indexes on `created_at` for fast queries
- Connection pooling for better performance

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all prerequisites are installed
3. Check browser console (F12) for errors
4. Check server console for error messages

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Arduino WiFiS3 Library](https://docs.arduino.cc/libraries/wifi-s3/)

---

**Happy monitoring! 🎉**
