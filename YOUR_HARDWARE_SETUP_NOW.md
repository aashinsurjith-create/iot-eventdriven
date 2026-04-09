# Your Hardware Setup - Do This Now!

Complete step-by-step to display your hardware output on the dashboard.

---

## ✅ Step 1: Find Your Computer's IP Address

### Windows (PowerShell):
```bash
ipconfig
```

Look for **"IPv4 Address"** - it will look like: `192.168.1.50`

### Mac/Linux (Terminal):
```bash
ifconfig
```

Look for **"inet"** address

**Write down your IP address**: `_________________`

---

## ✅ Step 2: Update Arduino Code with Your IP

1. Open Arduino IDE
2. Open the file: `ARDUINO_CODE.ino`
3. Find this line (around line 37):
   ```cpp
   const char* dashboardServerAddress = "192.168.1.100";  // CHANGE THIS TO YOUR IP!
   ```

4. Replace `192.168.1.100` with YOUR IP address:
   ```cpp
   const char* dashboardServerAddress = "192.168.1.50";  // Your actual IP
   ```

5. **Save the file** (Ctrl+S)

---

## ✅ Step 3: Install ArduinoHttpClient Library

1. In Arduino IDE, go to: **Sketch → Include Library → Manage Libraries**
2. Search for: `ArduinoHttpClient`
3. Click **Install**
4. Wait for installation to complete

---

## ✅ Step 4: Upload Code to Arduino

1. Connect Arduino to computer via USB
2. In Arduino IDE:
   - Tools → Board → **Arduino UNO R4 WiFi**
   - Tools → Port → **Select your COM port**
3. Click **Upload** button (→)
4. Wait for **"Done uploading"** message

---

## ✅ Step 5: Verify in Serial Monitor

1. Tools → **Serial Monitor**
2. Set baud rate to **9600**
3. You should see:

```
╔════════════════════════════════════════╗
║  Arduino IoT Dashboard + Blynk Node   ║
╚════════════════════════════════════════╝

Connecting to Blynk...
✓ Setup complete. Starting sensor readings...

Temp: 25.50°C | Humidity: 60.20% | Threshold: 27.50°C | Battery: 85.0% (FULL) | Event: NORMAL

>>> SENDING DATA <<<
--- Sending to Dashboard ---
Server: 192.168.1.100:3000
Payload: {"temperature":25.50,"humidity":60.20,"threshold_value":27.50,"battery_percentage":85.0,"battery_status":"FULL","event_status":"NORMAL"}
Response Status: 201
✓ Data sent to Dashboard successfully!
----------------------------

✓ Sent to Blynk
```

---

## ✅ Step 6: Open Dashboard

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see your sensor data:
   - Temperature: 25.50°C
   - Humidity: 60.20%
   - Threshold: 27.50°C
   - Battery: 85.0%
   - Battery Status: FULL
   - Event Status: NORMAL

---

## 🎯 What's Happening Now

### Every 1 Second:
- Arduino reads DHT22 (temperature & humidity)
- Arduino reads battery voltage from A0
- Arduino calculates threshold and detects events
- Arduino displays readings in Serial Monitor

### Based on Battery Level:
- **FULL (>70%)**: Send every 3 seconds
- **MEDIUM (40-70%)**: Send every 6 seconds
- **LOW (<40%)**: Send every 10 seconds (or on event)

### When Sending:
1. **Send to Blynk** (your existing app)
2. **Send to Dashboard** (our new web interface)

---

## 📊 Dashboard Features You Now Have

✅ **Live Data Cards**
- Temperature (real-time)
- Humidity (real-time)
- Threshold (calculated)
- Battery % (real-time)
- Battery Status (FULL/MEDIUM/LOW)
- Event Status (NORMAL/EVENT DETECTED)

✅ **Charts**
- Temperature trend (last 50 readings)
- Humidity trend (last 50 readings)
- Battery trend (last 50 readings)
- Threshold trend (last 50 readings)

✅ **Table**
- Recent readings (last 20)
- Timestamps for each reading

✅ **Statistics**
- Total readings today
- Average temperature
- Average humidity
- Event count

---

## 🧪 Test Your Setup

### Test 1: Verify Both Systems Work
- Check Serial Monitor for "✓ Data sent to Dashboard successfully!"
- Check Blynk app for updated values
- Check Dashboard for updated values

### Test 2: Temperature Change
- Heat or cool DHT22 sensor
- Serial Monitor shows new temperature
- Blynk app updates
- Dashboard updates within 2 seconds

### Test 3: Event Detection
- Rapidly change temperature (>1.5°C spike)
- Serial Monitor shows "EVENT DETECTED"
- Blynk app shows "EVENT DETECTED"
- Dashboard shows "EVENT DETECTED"

### Test 4: Battery Levels
- Simulate low battery (adjust voltage input to A0)
- Serial Monitor shows "LOW"
- Send interval increases to 10 seconds
- Blynk app shows "LOW"
- Dashboard shows "LOW"

---

## 🐛 Troubleshooting

### Serial Monitor shows error sending to Dashboard

**Problem**: 
```
✗ Dashboard error: Connection refused
```

**Solutions**:
1. ✅ Check server IP is correct (did you update it?)
2. ✅ Verify server is running (`npm start`)
3. ✅ Check firewall isn't blocking port 3000
4. ✅ Verify Arduino and computer on same network

### Dashboard shows no data

**Problem**: Dashboard is empty

**Solutions**:
1. ✅ Refresh page (Ctrl+R)
2. ✅ Check Serial Monitor shows "✓ Data sent to Dashboard successfully!"
3. ✅ Check browser console (F12) for errors
4. ✅ Verify server is running

### Blynk works but Dashboard doesn't

**Problem**: Blynk updates but Dashboard doesn't

**Solutions**:
1. ✅ Check server IP address is correct
2. ✅ Check ArduinoHttpClient library is installed
3. ✅ Check Serial Monitor for error messages
4. ✅ Verify WiFi connection is stable

### Both Blynk and Dashboard not working

**Problem**: Nothing updates

**Solutions**:
1. ✅ Check WiFi SSID and password
2. ✅ Verify WiFi is 2.4GHz (not 5GHz)
3. ✅ Check DHT22 sensor is connected to pin 4
4. ✅ Check battery voltage sensor is connected to A0
5. ✅ Restart Arduino

---

## ✅ Success Checklist

- [ ] Found your computer's IP address
- [ ] Updated IP in ARDUINO_CODE.ino
- [ ] Installed ArduinoHttpClient library
- [ ] Uploaded code to Arduino
- [ ] Serial Monitor shows sensor readings
- [ ] Serial Monitor shows "✓ Data sent to Dashboard successfully!"
- [ ] Blynk app shows updated values
- [ ] Dashboard shows updated values
- [ ] Dashboard updates every 2 seconds
- [ ] Charts display data
- [ ] Table shows recent readings

---

## 📞 Quick Reference

| Task | Command/Action |
|------|-----------------|
| Find IP | `ipconfig` (Windows) or `ifconfig` (Mac/Linux) |
| Open Serial Monitor | Tools → Serial Monitor (9600 baud) |
| Upload Code | Click Upload button in Arduino IDE |
| Open Dashboard | http://localhost:3000 |
| Check Server | http://localhost:3000/api/health |
| View Blynk | Open Blynk app on phone |

---

## 🎉 You Now Have

✅ **Blynk Integration** - Your existing mobile app
✅ **Dashboard Integration** - New web interface
✅ **Battery-Aware Transmission** - Saves power
✅ **Event Detection** - Alerts on temperature spikes
✅ **Data Storage** - MySQL database
✅ **Real-Time Charts** - Visual trends
✅ **Dual System** - Best of both worlds!

---

## 🚀 Next Steps

1. ✅ Update server IP in code
2. ✅ Install ArduinoHttpClient library
3. ✅ Upload new code
4. ✅ Verify in Serial Monitor
5. ✅ Check Dashboard
6. ✅ Check Blynk app
7. ✅ Test all features
8. ✅ Monitor your data!

---

**Your Arduino is now connected to both Blynk AND the Dashboard! 🎉**

**Time to complete: ~10 minutes**

Start with Step 1 above!
