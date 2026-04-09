# ⚡ GET STARTED NOW - 10 Minutes to Live Dashboard

Follow these exact steps to get your dashboard running.

---

## 🎯 What You'll Have in 10 Minutes

✅ Dashboard running at http://localhost:3000
✅ MySQL database storing sensor data
✅ Real-time charts and statistics
✅ Ready for Arduino integration

---

## 📋 Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js installed
node --version

# Check MySQL installed
mysql --version
```

If either is missing, install from:
- Node.js: https://nodejs.org/
- MySQL: https://www.mysql.com/

---

## 🚀 Step 1: Install Dependencies (1 minute)

Open terminal/command prompt in your project folder and run:

```bash
npm install
```

**Expected output:**
```
added 50 packages in 5s
```

---

## 🗄️ Step 2: Create Database (2 minutes)

Run this command:

```bash
mysql -u root -p < schema.sql
```

When prompted, enter your MySQL password (or press Enter if no password).

**Verify it worked:**
```bash
mysql -u root -p iot_microproject -e "SHOW TABLES;"
```

You should see:
```
+---------------------------+
| Tables_in_iot_microproject |
+---------------------------+
| sensor_readings           |
| daily_summary             |
+---------------------------+
```

---

## 🖥️ Step 3: Start Server (1 minute)

```bash
npm start
```

**Expected output:**
```
╔════════════════════════════════════════╗
║   IoT Dashboard Server Started         ║
╠════════════════════════════════════════╣
║ Server running on: http://localhost:3000  ║
║ Dashboard: http://localhost:3000       ║
║ API Health: http://localhost:3000/api/health ║
╚════════════════════════════════════════╝

✓ MySQL Database connected successfully
```

---

## 🌐 Step 4: Open Dashboard (1 minute)

Open your browser and go to:

```
http://localhost:3000
```

You should see the dashboard with empty cards (no data yet).

---

## 🧪 Step 5: Send Test Data (2 minutes)

Open a **new terminal** and run this command:

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

**Expected response:**
```json
{
  "success": true,
  "message": "Sensor data stored successfully",
  "id": 1
}
```

---

## 📊 Step 6: Refresh Dashboard (1 minute)

Go back to your browser and **refresh the page** (Ctrl+R or Cmd+R).

You should now see:
- ✅ Temperature: 25.5°C
- ✅ Humidity: 60.0%
- ✅ Threshold: 28.0°C
- ✅ Battery: 85.0%
- ✅ Battery Status: FULL
- ✅ Event Status: NORMAL

---

## 🎉 You're Done!

Your dashboard is now running! 

**Next steps:**

### Option A: Test More Data
Send more test data to see charts update:

```bash
# Send multiple readings
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/sensor-data \
    -H "Content-Type: application/json" \
    -d '{
      "temperature": '$(echo "20 + $i" | bc)',
      "humidity": '$(echo "50 + $i * 2" | bc)',
      "threshold_value": '$(echo "25 + $i" | bc)',
      "battery_percentage": '$(echo "100 - $i * 5" | bc)',
      "battery_status": "FULL",
      "event_status": "NORMAL"
    }'
  sleep 1
done
```

### Option B: Integrate Arduino
Follow the guide in **YOUR_ARDUINO_INTEGRATION.md** to connect your Arduino.

---

## 📁 Project Structure

```
arduino-iot-dashboard/
├── server.js              ← Backend server
├── db.js                  ← Database connection
├── package.json           ← Dependencies
├── schema.sql             ← Database schema
├── public/
│   ├── index.html         ← Dashboard page
│   ├── style.css          ← Styling
│   └── script.js          ← Dashboard logic
├── ARDUINO_CODE.ino       ← Arduino sketch
└── [Documentation files]
```

---

## 🔗 Important URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Dashboard |
| http://localhost:3000/api/latest | Latest reading |
| http://localhost:3000/api/history | Last 50 readings |
| http://localhost:3000/api/stats | Today's statistics |
| http://localhost:3000/api/health | Health check |

---

## 🐛 Quick Troubleshooting

### "npm: command not found"
→ Install Node.js from https://nodejs.org/

### "mysql: command not found"
→ Install MySQL from https://www.mysql.com/

### "Connection refused" (MySQL)
→ Start MySQL service:
- Windows: `net start MySQL80`
- Mac: `brew services start mysql`

### "Port 3000 in use"
→ Change port in server.js (line 8)

### "No data on dashboard"
→ Send test data using curl command above

---

## 📊 Dashboard Features

### Live Data Cards
- Real-time temperature, humidity, threshold
- Battery percentage and status
- Event status indicator

### Charts
- Temperature trend (last 50 readings)
- Humidity trend (last 50 readings)
- Battery level trend (last 50 readings)
- Threshold trend (last 50 readings)

### Table
- Recent 20 readings with timestamps
- Color-coded status indicators

### Statistics
- Total readings today
- Average temperature and humidity
- Event count

---

## 🔌 Arduino Integration

When ready to connect your Arduino:

1. Read **YOUR_ARDUINO_INTEGRATION.md**
2. Update WiFi credentials in Arduino code
3. Find your computer's IP address
4. Update server IP in Arduino code
5. Upload to Arduino
6. Watch data stream in real-time!

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| START_HERE.md | Navigation guide |
| QUICKSTART.md | 5-minute setup |
| YOUR_ARDUINO_INTEGRATION.md | Arduino integration |
| README.md | Full documentation |
| TEST_DATA.md | Testing guide |

---

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] MySQL installed
- [ ] npm install completed
- [ ] Database created
- [ ] Server started
- [ ] Dashboard loads
- [ ] Test data sent
- [ ] Data appears on dashboard
- [ ] Charts display
- [ ] Table shows data

---

## 🎯 What's Next?

1. **Explore the dashboard** - Click around, see all features
2. **Send more test data** - Watch charts update
3. **Check the database** - View stored data
4. **Integrate Arduino** - Connect your real sensors
5. **Customize** - Adjust colors, refresh rates, etc.

---

## 💡 Pro Tips

- Dashboard auto-refreshes every 2 seconds
- All data is stored in MySQL with timestamps
- You can view historical data in charts
- Keep Serial Monitor open while testing Arduino
- Use TEST_DATA.md for comprehensive testing

---

## 🚀 You're All Set!

Your IoT dashboard is ready to use. 

**Start monitoring your Arduino sensors now!**

---

## 📞 Need Help?

1. Check **START_HERE.md** for navigation
2. Check **YOUR_ARDUINO_INTEGRATION.md** for Arduino help
3. Check **README.md** for full documentation
4. Check **TEST_DATA.md** for testing examples

---

**Happy monitoring! 🎉**
