# 🔌 Your Arduino UNO R4 WiFi Integration Guide

Since you already have an Arduino project printing values to Serial Monitor, here's exactly how to integrate it with this dashboard.

---

## 📋 Your Current Arduino Output

Your Arduino currently prints:
```
Temperature: 25.5
Humidity: 60.0
Threshold: 28.0
Battery Percentage: 85.0
Battery Status: FULL
Event Status: NORMAL
```

---

## 🔄 Integration Steps

### Step 1: Identify Your Current Code

Find the section in your Arduino code that prints these values. It probably looks like:

```cpp
Serial.print("Temperature: ");
Serial.println(temperature);
Serial.print("Humidity: ");
Serial.println(humidity);
// ... etc
```

### Step 2: Add WiFi Libraries

Add these at the top of your Arduino code:

```cpp
#include <WiFiS3.h>
#include <ArduinoHttpClient.h>
```

### Step 3: Add WiFi Configuration

Add this after your includes:

```cpp
// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Server details (replace with your computer's IP)
const char* serverAddress = "192.168.1.100";
const int port = 3000;

WiFiClient wifiClient;
HttpClient client = HttpClient(wifiClient, serverAddress, port);
```

### Step 4: Add WiFi Connection Function

Add this function to your code:

```cpp
void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("✓ WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("✗ Failed to connect to WiFi");
  }
}
```

### Step 5: Add Data Sending Function

Add this function to send data to dashboard:

```cpp
void sendToDashboard(float temperature, float humidity, float threshold,
                     float batteryPercentage, String batteryStatus, 
                     String eventStatus) {
  
  // Create JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"temperature\":" + String(temperature, 2) + ",";
  jsonPayload += "\"humidity\":" + String(humidity, 2) + ",";
  jsonPayload += "\"threshold_value\":" + String(threshold, 2) + ",";
  jsonPayload += "\"battery_percentage\":" + String(batteryPercentage, 2) + ",";
  jsonPayload += "\"battery_status\":\"" + batteryStatus + "\",";
  jsonPayload += "\"event_status\":\"" + eventStatus + "\"";
  jsonPayload += "}";
  
  Serial.print("Sending to dashboard: ");
  Serial.println(jsonPayload);
  
  // Send POST request
  client.post("/api/sensor-data", "application/json", jsonPayload);
  
  // Get response
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();
  
  if (statusCode == 201 || statusCode == 200) {
    Serial.println("✓ Data sent to dashboard!");
  } else {
    Serial.print("✗ Error: ");
    Serial.println(statusCode);
  }
}
```

### Step 6: Modify Your Setup Function

In your `setup()` function, add WiFi connection:

```cpp
void setup() {
  Serial.begin(9600);
  delay(1000);
  
  // Your existing setup code...
  
  // Add this:
  connectToWiFi();
}
```

### Step 7: Modify Your Loop Function

In your `loop()` function, add data sending. Replace your Serial.print statements with:

```cpp
void loop() {
  // Your existing sensor reading code...
  // (keep reading temperature, humidity, etc.)
  
  // Print to Serial Monitor (keep this)
  Serial.print("Temperature: ");
  Serial.println(temperature);
  Serial.print("Humidity: ");
  Serial.println(humidity);
  Serial.print("Threshold: ");
  Serial.println(threshold);
  Serial.print("Battery Percentage: ");
  Serial.println(batteryPercentage);
  Serial.print("Battery Status: ");
  Serial.println(batteryStatus);
  Serial.print("Event Status: ");
  Serial.println(eventStatus);
  
  // Send to dashboard (add this)
  sendToDashboard(temperature, humidity, threshold, 
                  batteryPercentage, batteryStatus, eventStatus);
  
  // Wait before next reading (adjust as needed)
  delay(5000); // Send every 5 seconds
}
```

---

## 🖥️ Find Your Computer's IP Address

### Windows:
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

### Mac/Linux:
```bash
ifconfig
```
Look for "inet" address

---

## 📝 Complete Example Code

Here's a minimal complete example you can adapt:

```cpp
#include <WiFiS3.h>
#include <ArduinoHttpClient.h>

// WiFi Configuration
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* serverAddress = "192.168.1.100";  // Your computer's IP
const int port = 3000;

WiFiClient wifiClient;
HttpClient client = HttpClient(wifiClient, serverAddress, port);

// Sensor variables
float temperature = 0;
float humidity = 0;
float threshold = 0;
float batteryPercentage = 0;
String batteryStatus = "";
String eventStatus = "";

void setup() {
  Serial.begin(9600);
  delay(1000);
  
  Serial.println("\n\nArduino IoT Dashboard - Starting...");
  connectToWiFi();
}

void loop() {
  // Read your sensors (your existing code)
  readSensors();
  
  // Print to Serial Monitor (your existing code)
  printToSerialMonitor();
  
  // Send to dashboard (NEW)
  sendToDashboard(temperature, humidity, threshold, 
                  batteryPercentage, batteryStatus, eventStatus);
  
  delay(5000); // Send every 5 seconds
}

void readSensors() {
  // Your existing sensor reading code here
  // Example:
  temperature = analogRead(A0) * 0.1;
  humidity = analogRead(A1) * 0.1;
  threshold = temperature + 2.0;
  batteryPercentage = analogRead(A2) * 0.1;
  
  if (batteryPercentage >= 66) {
    batteryStatus = "FULL";
  } else if (batteryPercentage >= 33) {
    batteryStatus = "MEDIUM";
  } else {
    batteryStatus = "LOW";
  }
  
  eventStatus = "NORMAL"; // Or "EVENT DETECTED" based on your logic
}

void printToSerialMonitor() {
  Serial.println("─────────────────────────────────────");
  Serial.print("Temperature: ");
  Serial.println(temperature);
  Serial.print("Humidity: ");
  Serial.println(humidity);
  Serial.print("Threshold: ");
  Serial.println(threshold);
  Serial.print("Battery Percentage: ");
  Serial.println(batteryPercentage);
  Serial.print("Battery Status: ");
  Serial.println(batteryStatus);
  Serial.print("Event Status: ");
  Serial.println(eventStatus);
  Serial.println("─────────────────────────────────────");
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("✓ WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("✗ Failed to connect to WiFi");
  }
}

void sendToDashboard(float temperature, float humidity, float threshold,
                     float batteryPercentage, String batteryStatus, 
                     String eventStatus) {
  
  // Create JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"temperature\":" + String(temperature, 2) + ",";
  jsonPayload += "\"humidity\":" + String(humidity, 2) + ",";
  jsonPayload += "\"threshold_value\":" + String(threshold, 2) + ",";
  jsonPayload += "\"battery_percentage\":" + String(batteryPercentage, 2) + ",";
  jsonPayload += "\"battery_status\":\"" + batteryStatus + "\",";
  jsonPayload += "\"event_status\":\"" + eventStatus + "\"";
  jsonPayload += "}";
  
  Serial.print("Sending: ");
  Serial.println(jsonPayload);
  
  // Send POST request
  client.post("/api/sensor-data", "application/json", jsonPayload);
  
  // Get response
  int statusCode = client.responseStatusCode();
  
  if (statusCode == 201 || statusCode == 200) {
    Serial.println("✓ Data sent successfully!");
  } else {
    Serial.print("✗ Error: ");
    Serial.println(statusCode);
  }
}
```

---

## 🚀 Setup Checklist

- [ ] Update WiFi SSID and password
- [ ] Find your computer's IP address
- [ ] Update serverAddress in Arduino code
- [ ] Install ArduinoHttpClient library
- [ ] Upload code to Arduino
- [ ] Start Node.js server (`npm start`)
- [ ] Open dashboard (http://localhost:3000)
- [ ] Check Serial Monitor for connection status
- [ ] Verify data appears on dashboard

---

## 📊 What You'll See

### Serial Monitor Output:
```
Connecting to WiFi: MyNetwork
✓ WiFi connected!
IP Address: 192.168.1.50

─────────────────────────────────────
Temperature: 25.5
Humidity: 60.0
Threshold: 28.0
Battery Percentage: 85.0
Battery Status: FULL
Event Status: NORMAL
─────────────────────────────────────
Sending: {"temperature":25.5,"humidity":60.0,...}
✓ Data sent successfully!
```

### Dashboard Display:
- Live cards showing same values
- Charts updating in real-time
- Table showing recent readings
- Statistics updating

---

## 🔧 Troubleshooting

### Arduino can't connect to WiFi
- Check SSID and password
- Verify WiFi network is 2.4GHz (not 5GHz)
- Check Arduino is in range

### Arduino connects but data doesn't send
- Verify server IP address is correct
- Check server is running (`npm start`)
- Verify firewall isn't blocking port 3000
- Check Arduino and computer are on same network

### Data sends but doesn't appear on dashboard
- Refresh dashboard page
- Check browser console (F12) for errors
- Verify MySQL database is running
- Check server console for errors

### Serial Monitor shows errors
- Check JSON format is correct
- Verify all required fields are present
- Check data types match expected values

---

## 📡 JSON Payload Format

Your data must be sent as JSON with these exact fields:

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

**Important:**
- `temperature`, `humidity`, `threshold_value`, `battery_percentage` must be numbers
- `battery_status` must be: "FULL", "MEDIUM", or "LOW"
- `event_status` must be: "NORMAL" or "EVENT DETECTED"

---

## 🎯 Next Steps

1. **Modify your Arduino code** using the examples above
2. **Install ArduinoHttpClient** library in Arduino IDE
3. **Update WiFi credentials** and server IP
4. **Upload to Arduino**
5. **Start Node.js server**: `npm start`
6. **Open dashboard**: http://localhost:3000
7. **Watch data stream in real-time!**

---

## 💡 Tips

- Keep your Serial Monitor output for debugging
- Send data every 5 seconds (adjust `delay(5000)` as needed)
- Dashboard auto-refreshes every 2 seconds
- All data is stored in MySQL with timestamps
- You can view historical data in charts

---

## 📚 Additional Resources

- **Arduino WiFiS3 Library**: https://docs.arduino.cc/libraries/wifi-s3/
- **ArduinoHttpClient**: https://github.com/arduino-libraries/ArduinoHttpClient
- **JSON Format**: https://www.json.org/
- **REST API Basics**: https://restfulapi.net/

---

## ✅ Verification

After setup, verify everything works:

1. **Serial Monitor** shows WiFi connected
2. **Serial Monitor** shows data being sent
3. **Dashboard** loads at http://localhost:3000
4. **Dashboard** shows live values matching Serial Monitor
5. **Charts** display data points
6. **Table** shows recent readings
7. **Statistics** show totals and averages

---

**You're ready to integrate! 🚀**

Your Arduino will now send data to the dashboard while continuing to print to Serial Monitor. The dashboard will display everything in real-time with charts and statistics.

Happy monitoring!
