# Quick Reference Card

## 🚀 Start Here

```bash
npm install
mysql -u root -p < schema.sql
npm start
# Open http://localhost:3000
```

---

## 📡 Send Test Data

```bash
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.5,
    "humidity": 60.0,
    "threshold_value": 28.0,
    "battery_percentage": 85.0,
    "battery_status": "FULL",
    "event_status": "NORMAL"
  }'
```

---

## 🔗 API Endpoints

```
POST   /api/sensor-data    - Send data
GET    /api/latest         - Latest reading
GET    /api/history        - Last 50 readings
GET    /api/stats          - Today's stats
GET    /api/health         - Health check
```

---

## 🗄️ Database Commands

```bash
# Create database
mysql -u root -p < schema.sql

# Connect to database
mysql -u root -p iot_microproject

# View all data
SELECT * FROM sensor_readings;

# Count readings
SELECT COUNT(*) FROM sensor_readings;

# Get statistics
SELECT AVG(temperature), MAX(temperature), MIN(temperature) 
FROM sensor_readings;
```

---

## 🔌 Arduino Setup

1. Update WiFi credentials in ARDUINO_CODE.ino
2. Update server IP address
3. Install ArduinoHttpClient library
4. Upload to Arduino UNO R4 WiFi
5. Open Serial Monitor (9600 baud)

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| server.js | Backend server |
| db.js | Database connection |
| public/index.html | Dashboard |
| public/style.css | Styling |
| public/script.js | Dashboard logic |
| ARDUINO_CODE.ino | Arduino sketch |
| schema.sql | Database schema |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| npm not found | Install Node.js |
| MySQL not found | Install MySQL |
| Port 3000 in use | Change port in server.js |
| No data | Send test data with curl |
| Arduino can't connect | Check WiFi and IP |

---

## 📊 Dashboard URL

```
http://localhost:3000
```

---

## 🔑 Default Credentials

- MySQL User: `root`
- MySQL Password: (empty or your password)
- Database: `iot_microproject`
- Server Port: `3000`

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| START_HERE.md | Navigation |
| QUICKSTART.md | 5-min setup |
| SETUP_INSTRUCTIONS.md | Detailed setup |
| TEST_DATA.md | Testing |
| README.md | Full docs |
| PROJECT_SUMMARY.md | Overview |

---

## 🎯 Key Features

✅ Real-time dashboard
✅ 6 live data cards
✅ 4 interactive charts
✅ Recent readings table
✅ Daily statistics
✅ Auto-refresh (2 sec)
✅ Responsive design
✅ MySQL storage

---

## 🔄 Refresh Rates

- Dashboard: 2 seconds
- Arduino: 5 seconds (configurable)
- Charts: Real-time
- Table: Real-time

---

## 📱 Responsive Breakpoints

- Desktop: 1400px+
- Tablet: 768px - 1024px
- Mobile: < 768px

---

## 🧪 Test Scenarios

1. Single reading
2. Multiple readings
3. Battery transitions
4. Event detection
5. Temperature extremes
6. Error handling

---

## 💾 Database Tables

### sensor_readings
- id (PK)
- temperature
- humidity
- threshold_value
- battery_percentage
- battery_status
- event_status
- created_at (timestamp)

### daily_summary
- id (PK)
- date (unique)
- avg_temperature
- max_temperature
- min_temperature
- avg_humidity
- max_humidity
- min_humidity
- avg_battery
- event_count
- created_at

---

## 🔌 Arduino Pins

- A0: Temperature sensor
- A1: Humidity sensor
- A2: Battery sensor
- D2: Event button

---

## 📡 JSON Payload Format

```json
{
  "temperature": 25.5,
  "humidity": 60.0,
  "threshold_value": 28.0,
  "battery_percentage": 85.0,
  "battery_status": "FULL",
  "event_status": "NORMAL"
}
```

---

## ⚡ Performance

- API Response: < 100ms
- Chart Update: Real-time
- Database Query: Indexed
- Connection Pool: 10 connections
- Max Readings: 50 (charts)

---

## 🔒 Security

✅ Input validation
✅ Data type checking
✅ Range validation
✅ CORS enabled
✅ Error handling
✅ Graceful shutdown

---

## 🎨 Color Scheme

- Primary: #0066cc (Blue)
- Secondary: #00a8e8 (Cyan)
- Success: #06a77d (Green)
- Warning: #f77f00 (Orange)
- Danger: #d62828 (Red)
- Background: #0a0e27 (Dark)

---

## 📊 Chart Types

- Temperature: Line chart
- Humidity: Line chart
- Battery: Line chart
- Threshold: Line chart

---

## 🚀 Deployment

1. Install Node.js and MySQL
2. Run `npm install`
3. Create database with schema.sql
4. Update db.js if needed
5. Run `npm start`
6. Access at http://localhost:3000

---

## 📞 Support

- Docs: README.md
- Setup: SETUP_INSTRUCTIONS.md
- Testing: TEST_DATA.md
- Quick: QUICKSTART.md

---

## ✅ Verification

- [ ] Server running
- [ ] Dashboard loads
- [ ] Test data sends
- [ ] Data appears
- [ ] Charts update
- [ ] Table shows data
- [ ] Stats display
- [ ] Arduino connects

---

## 🎯 Next Steps

1. Read START_HERE.md
2. Choose your path
3. Follow the guide
4. Test with data
5. Upload Arduino code
6. Monitor sensors!

---

**Happy monitoring! 🚀**
