# Hardware Setup Checklist

Follow this checklist to connect your Arduino to the dashboard.

---

## ✅ Pre-Setup

- [ ] Arduino UNO R4 WiFi connected to computer via USB
- [ ] Arduino IDE installed
- [ ] Dashboard server running (`npm start`)
- [ ] MySQL database running
- [ ] Browser can access http://localhost:3000

---

## ✅ Step 1: Update Arduino Code

### WiFi Configuration
- [ ] Know your WiFi SSID (network name)
- [ ] Know your WiFi password
- [ ] Updated `ssid` in ARDUINO_CODE.ino
- [ ] Updated `password` in ARDUINO_CODE.ino

### Server Configuration
- [ ] Found your computer's IP address
  - Windows: Run `ipconfig` in PowerShell
  - Mac/Linux: Run `ifconfig` in terminal
- [ ] Updated `serverAddress` in ARDUINO_CODE.ino
- [ ] Verified IP is in format: 192.168.x.x

---

## ✅ Step 2: Connect Sensors

### Temperature Sensor (A0)
- [ ] Signal wire → Arduino A0
- [ ] GND wire → Arduino GND
- [ ] VCC wire → Arduino 5V
- [ ] Sensor powered on

### Humidity Sensor (A1)
- [ ] Signal wire → Arduino A1
- [ ] GND wire → Arduino GND
- [ ] VCC wire → Arduino 5V
- [ ] Sensor powered on

### Battery Voltage Sensor (A2)
- [ ] Signal wire → Arduino A2
- [ ] GND wire → Arduino GND
- [ ] VCC wire → Arduino 5V
- [ ] Sensor powered on

### Event Button (D2)
- [ ] Pin 1 → Arduino D2
- [ ] Pin 2 → Arduino GND
- [ ] Button responds to press

---

## ✅ Step 3: Install Libraries

- [ ] Opened Arduino IDE
- [ ] Went to Sketch → Include Library → Manage Libraries
- [ ] Searched for "ArduinoHttpClient"
- [ ] Clicked Install
- [ ] Verified WiFiS3 is available (built-in)

---

## ✅ Step 4: Upload Code

- [ ] Selected Board: Arduino UNO R4 WiFi
- [ ] Selected correct COM Port
- [ ] Clicked Upload button
- [ ] Waited for "Done uploading" message
- [ ] No errors in console

---

## ✅ Step 5: Verify Serial Connection

- [ ] Opened Serial Monitor (Tools → Serial Monitor)
- [ ] Set baud rate to 9600
- [ ] Saw startup message:
  ```
  ╔════════════════════════════════════════╗
  ║  Arduino IoT Dashboard - Sensor Node   ║
  ╚════════════════════════════════════════╝
  ```
- [ ] Saw "Connecting to WiFi..." message
- [ ] Saw "✓ WiFi connected!" message
- [ ] Saw IP address displayed
- [ ] Saw sensor readings appearing

---

## ✅ Step 6: Verify Data Transmission

- [ ] Serial Monitor shows:
  ```
  Temperature: XX.X °C
  Humidity: XX.X %
  Threshold: XX.X °C
  Battery: XX.X% (FULL/MEDIUM/LOW)
  Event Status: NORMAL/EVENT DETECTED
  ```
- [ ] Serial Monitor shows "✓ Data sent successfully!"
- [ ] Data appears every 5 seconds

---

## ✅ Step 7: Check Dashboard

- [ ] Opened http://localhost:3000 in browser
- [ ] Dashboard loaded without errors
- [ ] Connection status shows "Connected"
- [ ] Live data cards show values:
  - [ ] Temperature card shows correct value
  - [ ] Humidity card shows correct value
  - [ ] Threshold card shows correct value
  - [ ] Battery card shows correct percentage
  - [ ] Battery Status shows FULL/MEDIUM/LOW
  - [ ] Event Status shows NORMAL/EVENT DETECTED

---

## ✅ Step 8: Verify Real-Time Updates

- [ ] Dashboard updates every 2 seconds
- [ ] Charts show data points
- [ ] Table shows recent readings
- [ ] Statistics show correct totals
- [ ] Last update time changes

---

## ✅ Step 9: Test Sensor Changes

### Temperature Test
- [ ] Heat or cool temperature sensor
- [ ] Serial Monitor shows new value
- [ ] Dashboard updates within 2 seconds
- [ ] Chart shows trend

### Humidity Test
- [ ] Change humidity (breathe on sensor)
- [ ] Serial Monitor shows new value
- [ ] Dashboard updates within 2 seconds
- [ ] Chart shows trend

### Event Button Test
- [ ] Press button connected to D2
- [ ] Serial Monitor shows "EVENT DETECTED"
- [ ] Dashboard Event Status changes
- [ ] Release button
- [ ] Serial Monitor shows "NORMAL"
- [ ] Dashboard Event Status changes back

### Battery Test
- [ ] Adjust battery voltage input
- [ ] Serial Monitor shows new percentage
- [ ] Battery Status changes (FULL → MEDIUM → LOW)
- [ ] Dashboard updates

---

## ✅ Step 10: Troubleshooting

If something doesn't work:

### WiFi Connection Issues
- [ ] Checked SSID spelling
- [ ] Checked password spelling
- [ ] Verified WiFi is 2.4GHz (not 5GHz)
- [ ] Restarted Arduino
- [ ] Restarted WiFi router

### Data Not Appearing
- [ ] Verified server IP is correct
- [ ] Verified server is running (`npm start`)
- [ ] Checked firewall settings
- [ ] Verified Arduino and computer on same network
- [ ] Checked browser console (F12) for errors

### Sensor Readings Wrong
- [ ] Checked sensor wiring
- [ ] Verified sensor on correct pin
- [ ] Calibrated sensor
- [ ] Checked sensor power supply

---

## 🎯 Success Criteria

Your setup is complete when:

✅ Serial Monitor shows sensor readings
✅ Serial Monitor shows "Data sent successfully!"
✅ Dashboard displays live values
✅ Dashboard updates every 2 seconds
✅ Charts show data trends
✅ Table shows recent readings
✅ All 6 data cards show correct values
✅ Sensor changes reflect on dashboard
✅ Event button works
✅ Battery status changes correctly

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| Can't find IP | Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) |
| Upload fails | Check COM port and board selection |
| No Serial output | Check baud rate is 9600 |
| WiFi won't connect | Check SSID/password and WiFi is 2.4GHz |
| Data not on dashboard | Check server IP and firewall |
| Sensor readings wrong | Calibrate sensor or check wiring |

---

## 📚 Documentation

- **HARDWARE_INTEGRATION_GUIDE.md** - Detailed setup guide
- **TROUBLESHOOTING_ADVANCED.md** - Advanced troubleshooting
- **README.md** - Full documentation
- **ARDUINO_CODE.ino** - Arduino sketch

---

**Print this checklist and check off each item as you complete it!**

When all items are checked, your hardware is successfully connected to the dashboard! 🎉
