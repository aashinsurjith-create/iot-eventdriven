# Hardware to Dashboard - Complete Summary

Quick reference for connecting your Arduino hardware to the web dashboard.

---

## 🎯 What You Need to Do

### 1️⃣ Update Arduino Code (5 minutes)

**File**: `ARDUINO_CODE.ino`

**Change these lines:**

```cpp
// Line 28-30: WiFi Credentials
const char* ssid = "YOUR_SSID";              // Your WiFi network name
const char* password = "YOUR_PASSWORD";      // Your WiFi password

// Line 33: Server IP
const char* serverAddress = "192.168.1.100"; // Your computer's IP
```

**How to find your IP:**
- Windows: Open PowerShell, type `ipconfig`, look for "IPv4 Address"
- Mac/Linux: Open terminal, type `ifconfig`, look for "inet"

---

### 2️⃣ Connect Sensors to Arduino (10 minutes)

**Wiring:**

| Sensor | Arduino Pin | Wire Color |
|--------|------------|-----------|
| Temperature Signal | A0 | Yellow |
| Temperature GND | GND | Black |
| Temperature 5V | 5V | Red |
| Humidity Signal | A1 | Yellow |
| Humidity GND | GND | Black |
| Humidity 5V | 5V | Red |
| Battery Signal | A2 | Yellow |
| Battery GND | GND | Black |
| Battery 5V | 5V | Red |
| Button Pin 1 | D2 | Green |
| Button Pin 2 | GND | Black |

**See**: `WIRING_DIAGRAM.md` for detailed diagrams

---

### 3️⃣ Install Libraries (2 minutes)

In Arduino IDE:
1. Sketch → Include Library → Manage Libraries
2. Search: "ArduinoHttpClient"
3. Click Install
4. WiFiS3 is built-in (no install needed)

---

### 4️⃣ Upload Code (3 minutes)

1. Connect Arduino to computer via USB
2. Tools → Board → Arduino UNO R4 WiFi
3. Tools → Port → Select your COM port
4. Click Upload button
5. Wait for "Done uploading"

---

### 5️⃣ Verify Connection (2 minutes)

1. Tools → Serial Monitor
2. Set baud rate to 9600
3. You should see:
   ```
   ✓ WiFi connected!
   IP Address: 192.168.1.50
   
   Temperature: 25.5 °C
   Humidity: 60.0 %
   Threshold: 27.5 °C
   Battery: 85.0% (FULL)
   Event Status: NORMAL
   ✓ Data sent successfully!
   ```

---

### 6️⃣ Check Dashboard (1 minute)

1. Open browser
2. Go to: http://localhost:3000
3. You should see:
   - Temperature: 25.5°C
   - Humidity: 60.0%
   - Threshold: 27.5°C
   - Battery: 85.0%
   - Battery Status: FULL
   - Event Status: NORMAL

---

## 📊 Data Flow

```
Arduino Sensors
    ↓
Arduino Reads Values
    ↓
Arduino Connects to WiFi
    ↓
Arduino Sends HTTP POST to Backend
    ↓
Backend Receives Data
    ↓
Backend Stores in MySQL
    ↓
Dashboard Fetches Data
    ↓
Dashboard Displays Live Values
    ↓
Charts Update
    ↓
Table Updates
```

---

## 🔄 How It Works

### Every 5 Seconds:

1. **Arduino reads sensors:**
   - Temperature from A0
   - Humidity from A1
   - Battery from A2
   - Button from D2

2. **Arduino creates JSON:**
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

3. **Arduino sends to backend:**
   ```
   POST http://192.168.1.100:3000/api/sensor-data
   ```

4. **Backend stores in MySQL:**
   ```sql
   INSERT INTO sensor_readings VALUES (...)
   ```

5. **Dashboard fetches data:**
   ```
   GET http://localhost:3000/api/latest
   ```

6. **Dashboard displays:**
   - Live cards update
   - Charts update
   - Table updates
   - Statistics update

---

## 🧪 Testing

### Test 1: Temperature
- Heat sensor with hand
- Serial Monitor shows increase
- Dashboard updates within 2 seconds

### Test 2: Humidity
- Breathe on sensor
- Serial Monitor shows increase
- Dashboard updates within 2 seconds

### Test 3: Event Button
- Press button
- Serial Monitor shows "EVENT DETECTED"
- Dashboard Event Status changes
- Release button
- Serial Monitor shows "NORMAL"
- Dashboard Event Status changes back

### Test 4: Battery
- Adjust voltage input
- Serial Monitor shows new percentage
- Battery Status changes (FULL → MEDIUM → LOW)
- Dashboard updates

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Arduino won't upload | Check COM port and board selection |
| No Serial output | Check baud rate is 9600 |
| WiFi won't connect | Check SSID/password, verify 2.4GHz |
| Data not on dashboard | Check server IP, verify server running |
| Sensor reads 0 or 1023 | Check wiring, verify sensor power |
| Button doesn't work | Check wiring to D2 and GND |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| ARDUINO_CODE.ino | Arduino sketch (update WiFi/IP) |
| WIRING_DIAGRAM.md | Sensor connection diagrams |
| HARDWARE_INTEGRATION_GUIDE.md | Detailed setup guide |
| HARDWARE_SETUP_CHECKLIST.md | Step-by-step checklist |
| server.js | Backend API (already running) |
| public/index.html | Dashboard (already running) |

---

## ✅ Success Checklist

- [ ] Updated WiFi SSID and password
- [ ] Updated server IP address
- [ ] Connected all sensors to correct pins
- [ ] Installed ArduinoHttpClient library
- [ ] Uploaded code to Arduino
- [ ] Serial Monitor shows sensor readings
- [ ] Serial Monitor shows "Data sent successfully!"
- [ ] Dashboard shows live values
- [ ] Dashboard updates every 2 seconds
- [ ] Charts show data trends
- [ ] Table shows recent readings

---

## 🎯 Next Steps

1. **Update Arduino code** with your WiFi and server IP
2. **Connect sensors** to Arduino pins
3. **Install libraries** in Arduino IDE
4. **Upload code** to Arduino
5. **Check Serial Monitor** for sensor readings
6. **Open dashboard** at http://localhost:3000
7. **Verify data** appears on dashboard
8. **Test sensors** by changing values
9. **Calibrate** if readings are off
10. **Monitor** your data in real-time!

---

## 📞 Need Help?

- **Wiring issues?** → See WIRING_DIAGRAM.md
- **Setup issues?** → See HARDWARE_INTEGRATION_GUIDE.md
- **Troubleshooting?** → See TROUBLESHOOTING_ADVANCED.md
- **General help?** → See README.md

---

## 🎉 You're Ready!

Your hardware is now connected to the dashboard!

**Time to complete: ~25 minutes**

1. Update code: 5 min
2. Connect sensors: 10 min
3. Install libraries: 2 min
4. Upload code: 3 min
5. Verify: 2 min
6. Check dashboard: 1 min
7. Test: 2 min

---

**Start with Step 1 above and follow the checklist!**

Your Arduino data will be live on the dashboard in less than 30 minutes! 🚀
