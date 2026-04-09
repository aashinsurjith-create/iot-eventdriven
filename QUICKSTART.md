# Quick Start Guide - Arduino IoT Dashboard

Get your dashboard running in 5 minutes!

## ⚡ 5-Minute Setup

### 1. Install Dependencies (1 minute)

```bash
npm install
```

### 2. Create Database (1 minute)

**Windows/Mac/Linux:**
```bash
mysql -u root -p < schema.sql
```

If you don't have a MySQL password, just press Enter when prompted.

### 3. Start Server (1 minute)

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   IoT Dashboard Server Started         ║
╠════════════════════════════════════════╣
║ Server running on: http://localhost:3000  ║
```

### 4. Open Dashboard (1 minute)

Go to: **http://localhost:3000**

### 5. Send Test Data (1 minute)

Open a new terminal and run:

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

**You should see data appear on the dashboard!**

---

## 🔌 Arduino Setup

### Step 1: Update Arduino Code

Edit `ARDUINO_CODE.ino`:

```cpp
// Line 24-25: Update WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Line 28: Update server IP (your computer's IP)
const char* serverAddress = "192.168.1.100";
```

### Step 2: Find Your Computer's IP

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address

### Step 3: Upload to Arduino

1. Open Arduino IDE
2. Open `ARDUINO_CODE.ino`
3. Select Board: Arduino UNO R4 WiFi
4. Select Port: COM3 (or your port)
5. Click Upload
6. Open Serial Monitor (9600 baud)

### Step 4: Verify Connection

You should see in Serial Monitor:
```
✓ WiFi connected!
IP Address: 192.168.1.50
Signal Strength: -45 dBm

Temperature: 25.5 °C
Humidity: 60.0 %
...
✓ Data sent successfully!
```

---

## 📊 What You'll See

### Dashboard Features

1. **Live Data Cards** - Real-time sensor values
2. **Charts** - Temperature, humidity, battery trends
3. **Recent Readings** - Last 20 sensor readings in a table
4. **Statistics** - Today's averages and totals

### Auto-Refresh

Dashboard updates every 2 seconds automatically.

---

## 🧪 Testing Without Arduino

### Test 1: Send Single Reading

```bash
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 22.5,
    "humidity": 55.0,
    "threshold_value": 25.0,
    "battery_percentage": 90.0,
    "battery_status": "FULL",
    "event_status": "NORMAL"
  }'
```

### Test 2: Get Latest Reading

```bash
curl http://localhost:3000/api/latest
```

### Test 3: Get History

```bash
curl http://localhost:3000/api/history
```

### Test 4: Get Statistics

```bash
curl http://localhost:3000/api/stats
```

### Test 5: Health Check

```bash
curl http://localhost:3000/api/health
```

---

## 🐛 Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/

### "Cannot find module 'express'"
- Run: `npm install`

### "Connection refused" (MySQL)
- Make sure MySQL is running
- Windows: `net start MySQL80`
- Mac: `brew services start mysql`

### "No data available" on dashboard
- Send test data using curl command above
- Check browser console (F12) for errors

### Arduino can't connect
- Verify WiFi SSID and password
- Check server IP address is correct
- Ensure Arduino and computer are on same network
- Check firewall isn't blocking port 3000

### Dashboard not updating
- Refresh page (Ctrl+R or Cmd+R)
- Check browser console for errors
- Verify server is running

---

## 📁 Project Files

```
├── server.js           ← Express server (don't modify)
├── db.js              ← Database connection (modify if needed)
├── package.json       ← Dependencies (don't modify)
├── schema.sql         ← Database schema (run once)
├── ARDUINO_CODE.ino   ← Arduino sketch (modify WiFi/IP)
├── README.md          ← Full documentation
├── QUICKSTART.md      ← This file
└── public/
    ├── index.html     ← Dashboard page
    ├── style.css      ← Dashboard styling
    └── script.js      ← Dashboard logic
```

---

## 🎯 Next Steps

1. ✅ Get dashboard running
2. ✅ Test with curl commands
3. ✅ Upload Arduino code
4. ✅ Watch real-time data stream
5. ✅ Customize sensor calibration
6. ✅ Deploy to production (optional)

---

## 💡 Tips

- **Sensor Calibration**: Adjust `TEMP_SCALE` and `HUMIDITY_SCALE` in Arduino code
- **Send Interval**: Change `SEND_INTERVAL` in Arduino code (default 5 seconds)
- **Dashboard Refresh**: Change `REFRESH_INTERVAL` in `public/script.js` (default 2 seconds)
- **Database**: View data with: `mysql -u root -p iot_microproject`

---

## 📞 Need Help?

1. Check README.md for detailed documentation
2. Check browser console (F12) for JavaScript errors
3. Check server console for backend errors
4. Check Arduino Serial Monitor for connection issues

---

**You're all set! Happy monitoring! 🚀**
