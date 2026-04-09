# Hardware Integration Guide - Arduino to Dashboard

Complete step-by-step guide to connect your Arduino UNO R4 WiFi to the dashboard.

---

## 🎯 Overview

Your Arduino will:
1. Read sensor values from analog pins
2. Connect to WiFi
3. Send data to your backend server
4. Dashboard displays the data in real-time

---

## 📋 Step 1: Prepare Your Arduino Code

### 1.1 Update WiFi Credentials

Open `ARDUINO_CODE.ino` and find these lines (around line 28-30):

```cpp
// Replace with your WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
```

**Change to your actual WiFi:**
```cpp
const char* ssid = "MyWiFiNetwork";
const char* password = "MyWiFiPassword123";
```

### 1.2 Find Your Computer's IP Address

**Windows (PowerShell):**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address

### 1.3 Update Server IP Address

Find this line (around line 33):
```cpp
const char* serverAddress = "192.168.1.100";
```

**Change to your computer's IP:**
```cpp
const char* serverAddress = "192.168.1.50";  // Your actual IP
```

---

## 🔌 Step 2: Connect Sensors to Arduino

### Pin Configuration

Connect your sensors to these Arduino pins:

| Sensor | Arduino Pin | Type |
|--------|------------|------|
| Temperature Sensor | A0 | Analog |
| Humidity Sensor | A1 | Analog |
| Battery Voltage | A2 | Analog |
| Event Button | D2 | Digital |
| GND | GND | Ground |
| 5V | 5V | Power |

### Wiring Example

```
Temperature Sensor:
  - Signal → A0
  - GND → GND
  - VCC → 5V

Humidity Sensor:
  - Signal → A1
  - GND → GND
  - VCC → 5V

Battery Voltage Sensor:
  - Signal → A2
  - GND → GND
  - VCC → 5V

Event Button:
  - Pin 1 → D2
  - Pin 2 → GND
```

---

## 📊 Step 3: Understand Sensor Reading Functions

The Arduino code has functions to read each sensor:

### Temperature Reading
```cpp
float readTemperature() {
  int rawValue = analogRead(TEMP_SENSOR_PIN);
  float voltage = (rawValue / 1023.0) * 5.0;
  float temperature = voltage * 100.0;  // For LM35: 10mV per °C
  temperature = temperature * TEMP_SCALE + TEMP_OFFSET;
  return temperature;
}
```

**For different sensors, adjust:**
- `TEMP_SCALE` - Multiply factor
- `TEMP_OFFSET` - Add offset

### Humidity Reading
```cpp
float readHumidity() {
  int rawValue = analogRead(HUMIDITY_SENSOR_PIN);
  float humidity = (rawValue / 1023.0) * 100.0;
  humidity = humidity * HUMIDITY_SCALE + HUMIDITY_OFFSET;
  humidity = constrain(humidity, 0, 100);
  return humidity;
}
```

### Battery Reading
```cpp
float readBatteryPercentage() {
  int rawValue = analogRead(BATTERY_SENSOR_PIN);
  float voltage = (rawValue / 1023.0) * 5.0;
  float percentage = ((voltage - 3.0) / (4.2 - 3.0)) * 100.0;
  percentage = constrain(percentage, 0, 100);
  return percentage;
}
```

---

## 🔧 Step 4: Calibrate Your Sensors

### Temperature Sensor Calibration

1. **Measure actual temperature** with a thermometer
2. **Read Arduino value** from Serial Monitor
3. **Calculate offset:**
   ```
   TEMP_OFFSET = Actual Temperature - Arduino Reading
   ```

Example:
- Actual: 25°C
- Arduino reads: 24.5°C
- TEMP_OFFSET = 25 - 24.5 = 0.5

Update in code:
```cpp
const float TEMP_OFFSET = 0.5;
```

### Humidity Sensor Calibration

Similar process:
1. Measure actual humidity
2. Read Arduino value
3. Calculate offset

### Battery Voltage Calibration

Adjust these values based on your battery:
```cpp
const float BATTERY_MAX_VOLTAGE = 5.0;  // Your max voltage
```

For Li-ion batteries:
- 3.0V = 0%
- 4.2V = 100%

---

## 📥 Step 5: Install Required Libraries

### In Arduino IDE:

1. Go to **Sketch → Include Library → Manage Libraries**
2. Search for **"ArduinoHttpClient"**
3. Click **Install**
4. Search for **"WiFiS3"** (should be built-in)

---

## 📤 Step 6: Upload Code to Arduino

### 1. Connect Arduino to Computer
- Use USB cable
- Arduino should appear in Device Manager

### 2. Select Board
- Tools → Board → Arduino UNO R4 WiFi

### 3. Select Port
- Tools → Port → COM3 (or your port)

### 4. Upload
- Click Upload button (→)
- Wait for "Done uploading"

---

## 🔍 Step 7: Verify Connection

### Open Serial Monitor

1. Tools → Serial Monitor
2. Set baud rate to **9600**
3. You should see:

```
╔════════════════════════════════════════╗
║  Arduino IoT Dashboard - Sensor Node   ║
╚════════════════════════════════════════╝

Connecting to WiFi: MyWiFiNetwork
.....
✓ WiFi connected!
IP Address: 192.168.1.50
Signal Strength: -45 dBm

✓ Setup complete. Starting sensor readings...

─────────────────────────────────────────
Temperature: 25.5 °C
Humidity: 60.0 %
Threshold: 27.5 °C
Battery: 85.0% (FULL)
Event Status: NORMAL
─────────────────────────────────────────
✓ Data sent successfully!
```

---

## 📊 Step 8: Check Dashboard

### Open Dashboard
Go to: **http://localhost:3000**

### You should see:
- **Temperature Card**: 25.5°C
- **Humidity Card**: 60.0%
- **Threshold Card**: 27.5°C
- **Battery Card**: 85.0%
- **Battery Status**: FULL
- **Event Status**: NORMAL

### Data updates every 5 seconds

---

## 🧪 Step 9: Test Different Scenarios

### Test 1: Change Temperature
- Heat or cool the temperature sensor
- Watch Serial Monitor and Dashboard update

### Test 2: Change Humidity
- Breathe on humidity sensor or use water
- Watch values change

### Test 3: Press Event Button
- Press the button connected to D2
- Event Status should change to "EVENT DETECTED"

### Test 4: Simulate Low Battery
- Adjust battery voltage input
- Battery Status should change to "MEDIUM" or "LOW"

---

## 🐛 Troubleshooting

### Arduino can't connect to WiFi

**Problem**: Serial shows "Connecting to WiFi..." but never connects

**Solutions**:
1. Check WiFi SSID and password are correct
2. Verify WiFi is 2.4GHz (not 5GHz)
3. Check Arduino is in range
4. Restart Arduino and WiFi router

### Data not appearing on dashboard

**Problem**: Serial shows "Data sent successfully!" but dashboard is empty

**Solutions**:
1. Check server IP address is correct
2. Verify server is running (`npm start`)
3. Check firewall isn't blocking port 3000
4. Verify Arduino and computer are on same network

### Sensor readings are wrong

**Problem**: Serial shows incorrect values

**Solutions**:
1. Check sensor wiring
2. Verify sensor is connected to correct pin
3. Calibrate sensor (see Step 4)
4. Check sensor power supply

### Dashboard shows old data

**Problem**: Dashboard doesn't update with new readings

**Solutions**:
1. Refresh page (Ctrl+R)
2. Check browser console (F12) for errors
3. Verify Arduino is still sending data
4. Check Serial Monitor for errors

---

## 📝 Customization

### Change Send Interval

Default: 5 seconds

Find this line:
```cpp
const unsigned long SEND_INTERVAL = 5000;  // milliseconds
```

Change to:
```cpp
const unsigned long SEND_INTERVAL = 2000;  // 2 seconds
```

### Change Sensor Pins

If using different pins, update:
```cpp
const int TEMP_SENSOR_PIN = A0;      // Change to your pin
const int HUMIDITY_SENSOR_PIN = A1;  // Change to your pin
const int BATTERY_SENSOR_PIN = A2;   // Change to your pin
const int EVENT_BUTTON_PIN = 2;      // Change to your pin
```

### Add More Sensors

1. Add pin definition:
   ```cpp
   const int NEW_SENSOR_PIN = A3;
   ```

2. Add reading function:
   ```cpp
   float readNewSensor() {
     int rawValue = analogRead(NEW_SENSOR_PIN);
     float value = (rawValue / 1023.0) * 100.0;
     return value;
   }
   ```

3. Add to JSON payload in `sendSensorData()`

---

## 🎯 Complete Workflow

1. ✅ Update WiFi credentials
2. ✅ Update server IP
3. ✅ Connect sensors to Arduino
4. ✅ Install libraries
5. ✅ Upload code
6. ✅ Check Serial Monitor
7. ✅ Open dashboard
8. ✅ Verify data appears
9. ✅ Test different scenarios
10. ✅ Calibrate if needed

---

## 📞 Quick Reference

| Task | Command/Action |
|------|-----------------|
| Find IP | `ipconfig` (Windows) or `ifconfig` (Mac/Linux) |
| Open Serial Monitor | Tools → Serial Monitor (9600 baud) |
| Upload Code | Click Upload button in Arduino IDE |
| Open Dashboard | http://localhost:3000 |
| Check Server | http://localhost:3000/api/health |
| View Database | `mysql -u root -p iot_microproject` |

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Serial Monitor shows sensor readings
- ✅ Serial Monitor shows "Data sent successfully!"
- ✅ Dashboard shows live values
- ✅ Dashboard updates every 5 seconds
- ✅ Charts show data trends
- ✅ Table shows recent readings

---

**Your hardware is now connected to the dashboard! 🎉**

For more help, check:
- TROUBLESHOOTING_ADVANCED.md
- README.md
- TEST_DATA.md
