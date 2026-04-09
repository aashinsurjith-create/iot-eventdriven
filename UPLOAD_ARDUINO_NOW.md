# Upload Arduino Code Now - Complete Guide

Your Arduino code is ready with the correct IP address: **10.148.26.208**

---

## 🎯 What's Been Done

✅ Arduino code updated with your IP: `10.148.26.208`
✅ Code includes Blynk integration
✅ Code includes Dashboard integration
✅ Code ready to upload

---

## 📋 Step 1: Install Required Library

You need to install **ArduinoHttpClient** library.

### In Arduino IDE:
1. Click: **Sketch → Include Library → Manage Libraries**
2. Search for: `ArduinoHttpClient`
3. Click **Install** button
4. Wait for installation to complete

**Screenshot:**
```
Sketch Menu
  ↓
Include Library
  ↓
Manage Libraries
  ↓
Search: ArduinoHttpClient
  ↓
Click Install
```

---

## 📤 Step 2: Upload Code to Arduino

### 1. Connect Arduino to Computer
- Use USB cable
- Arduino should appear in Device Manager

### 2. Open Arduino IDE
- Open the file: `ARDUINO_CODE.ino`

### 3. Select Board
- Click: **Tools → Board → Arduino UNO R4 WiFi**

### 4. Select Port
- Click: **Tools → Port → COM3** (or your port)
- You should see your Arduino listed

### 5. Upload Code
- Click the **Upload** button (→ arrow icon)
- Wait for message: **"Done uploading"**

**If you see errors:**
- Check board is selected correctly
- Check port is selected correctly
- Try again

---

## 🔍 Step 3: Verify in Serial Monitor

### 1. Open Serial Monitor
- Click: **Tools → Serial Monitor**

### 2. Set Baud Rate
- Bottom right corner: Set to **9600**

### 3. You Should See:

```
╔════════════════════════════════════════╗
║  Arduino IoT Dashboard + Blynk Node   ║
╚════════════════════════════════════════╝

Connecting to Blynk...
✓ Setup complete. Starting sensor readings...

Temp: 25.50°C | Humidity: 60.20% | Threshold: 27.50°C | Battery: 85.0% (FULL) | Event: NORMAL

>>> SENDING DATA <<<
--- Sending to Dashboard ---
Server: 10.148.26.208:3000
Payload: {"temperature":25.50,"humidity":60.20,"threshold_value":27.50,"battery_percentage":85.0,"battery_status":"FULL","event_status":"NORMAL"}
Response Status: 201
✓ Data sent to Dashboard successfully!
----------------------------

✓ Sent to Blynk
```

---

## 📊 Step 4: Check Dashboard

### 1. Open Browser
- Go to: **http://localhost:3000**

### 2. You Should See:
- Temperature: 25.50°C
- Humidity: 60.20%
- Threshold: 27.50°C
- Battery: 85.0%
- Battery Status: FULL
- Event Status: NORMAL

### 3. Data Updates Every 2 Seconds
- Watch the "Last update" time change
- Charts should show data points
- Table should show recent readings

---

## ✅ Success Indicators

You'll know it's working when:

✅ Serial Monitor shows sensor readings
✅ Serial Monitor shows "✓ Data sent to Dashboard successfully!"
✅ Dashboard shows live values
✅ Dashboard updates every 2 seconds
✅ Charts display data
✅ Table shows recent readings
✅ Blynk app shows updated values

---

## 🐛 Troubleshooting

### Serial Monitor shows nothing
**Problem**: No output in Serial Monitor

**Solutions**:
1. Check baud rate is set to 9600
2. Check USB cable is connected
3. Check correct COM port is selected
4. Try different USB port on computer

### Serial Monitor shows error sending to Dashboard
**Problem**: 
```
✗ Dashboard error: Connection refused
```

**Solutions**:
1. ✅ Verify server is running (`npm start`)
2. ✅ Check firewall isn't blocking port 3000
3. ✅ Verify Arduino and computer on same network
4. ✅ Try pinging the IP: `ping 10.148.26.208`

### Dashboard shows no data
**Problem**: Dashboard is empty

**Solutions**:
1. ✅ Refresh page (Ctrl+R)
2. ✅ Check Serial Monitor shows "✓ Data sent to Dashboard successfully!"
3. ✅ Check browser console (F12) for errors
4. ✅ Verify server is running

### Upload fails
**Problem**: "Done uploading" doesn't appear

**Solutions**:
1. ✅ Check board is: Arduino UNO R4 WiFi
2. ✅ Check port is correct
3. ✅ Try different USB port
4. ✅ Restart Arduino IDE

---

## 📝 Your Configuration

**IP Address**: 10.148.26.208
**Port**: 3000
**WiFi SSID**: poco
**WiFi Password**: 12345678
**DHT22 Pin**: 4
**Battery Pin**: A0
**Blynk Template ID**: TMPL3NoU-Vsju
**Blynk Auth Token**: Mqg3EWzG_Z-jEQm2thIbFtJ6kkuetb8n

---

## 🎯 What Happens Next

### Every 1 Second:
- Arduino reads DHT22 (temperature & humidity)
- Arduino reads battery voltage from A0
- Arduino calculates threshold and detects events

### Based on Battery Level:
- **FULL (>70%)**: Send every 3 seconds
- **MEDIUM (40-70%)**: Send every 6 seconds
- **LOW (<40%)**: Send every 10 seconds (or on event)

### When Sending:
1. Send to Blynk (your mobile app)
2. Send to Dashboard (web interface)
3. Data stored in MySQL database

---

## 📊 Dashboard Features

✅ **Live Data Cards** - Real-time sensor values
✅ **4 Charts** - Temperature, Humidity, Battery, Threshold trends
✅ **Recent Readings Table** - Last 20 readings with timestamps
✅ **Daily Statistics** - Totals and averages
✅ **Auto-Refresh** - Updates every 2 seconds
✅ **Professional UI** - Dark theme, responsive design

---

## 🚀 Quick Checklist

- [ ] Installed ArduinoHttpClient library
- [ ] Connected Arduino to computer via USB
- [ ] Selected correct board (Arduino UNO R4 WiFi)
- [ ] Selected correct COM port
- [ ] Clicked Upload button
- [ ] Saw "Done uploading" message
- [ ] Opened Serial Monitor
- [ ] Set baud rate to 9600
- [ ] See sensor readings in Serial Monitor
- [ ] See "✓ Data sent to Dashboard successfully!"
- [ ] Opened http://localhost:3000
- [ ] See sensor data on dashboard
- [ ] Dashboard updates every 2 seconds

---

## 📞 Need Help?

| Issue | Solution |
|-------|----------|
| No Serial output | Check baud rate is 9600 |
| Upload fails | Check board and port selection |
| Dashboard empty | Check server is running |
| Data not sending | Check IP address and firewall |
| Blynk not updating | Check Blynk connection |

---

## 🎉 You're Ready!

Your Arduino is configured and ready to upload!

**Next Steps:**
1. Install ArduinoHttpClient library
2. Upload code to Arduino
3. Check Serial Monitor
4. Open dashboard
5. Watch your data stream in real-time!

---

**Time to complete: ~5 minutes**

Start with Step 1 above!
