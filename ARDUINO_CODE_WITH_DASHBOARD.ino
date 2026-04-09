/*
  Arduino UNO R4 WiFi - IoT Dashboard + Blynk Integration
  
  This sketch reads sensor data from DHT22 and battery voltage,
  sends to both Blynk AND our custom IoT Dashboard backend.
  
  Required Libraries:
  - WiFiS3 (built-in)
  - DHT (install via Arduino IDE)
  - BlynkSimpleWifi (install via Arduino IDE)
  - ArduinoHttpClient (install via Arduino IDE)
  
  Sensors:
  - DHT22: Pin 4 (Temperature & Humidity)
  - Battery Voltage: A0 (Analog)
*/

#define BLYNK_TEMPLATE_ID "TMPL3NoU-Vsju"
#define BLYNK_TEMPLATE_NAME "Battery Aware IoT Node"
#define BLYNK_AUTH_TOKEN "Mqg3EWzG_Z-jEQm2thIbFtJ6kkuetb8n"

#include <SPI.h>
#include <WiFiS3.h>
#include <DHT.h>
#include <BlynkSimpleWifi.h>
#include <ArduinoHttpClient.h>

// ============================================
// WiFi Configuration
// ============================================
char ssid[] = "poco";
char pass[] = "12345678";

// ============================================
// Dashboard Backend Configuration
// ============================================
// IMPORTANT: Update this to your computer's IP address
const char* dashboardServerAddress = "192.168.1.100";  // Change this!
const int dashboardPort = 3000;

// ============================================
// Sensor Configuration
// ============================================
#define DHTPIN 4
#define DHTTYPE DHT22
#define ADC_RESOLUTION 4095.0
#define VREF 5.0

DHT dht(DHTPIN, DHTTYPE);

// ============================================
// WiFi Client for Dashboard
// ============================================
WiFiClient wifiClient;
HttpClient dashboardClient = HttpClient(wifiClient, dashboardServerAddress, dashboardPort);

// ============================================
// Temperature Averaging
// ============================================
float readings[10];
int idx = 0;
bool filled = false;

float previousTemp = 0;
bool firstReading = true;
unsigned long lastSendTime = 0;

// ============================================
// Get Average Temperature
// ============================================
float getAverage() {
  int count = filled ? 10 : idx;
  if (count == 0) return 0;
  float sum = 0;
  for (int i = 0; i < count; i++) {
    sum += readings[i];
  }
  return sum / count;
}

// ============================================
// Send Data to Dashboard Backend
// ============================================
void sendToDashboard(float temperature, float humidity, float threshold, 
                     float batteryPercentage, String batteryStatus, String eventStatus) {
  try {
    // Create JSON payload
    String jsonPayload = "{";
    jsonPayload += "\"temperature\":" + String(temperature, 2) + ",";
    jsonPayload += "\"humidity\":" + String(humidity, 2) + ",";
    jsonPayload += "\"threshold_value\":" + String(threshold, 2) + ",";
    jsonPayload += "\"battery_percentage\":" + String(batteryPercentage, 1) + ",";
    jsonPayload += "\"battery_status\":\"" + batteryStatus + "\",";
    jsonPayload += "\"event_status\":\"" + eventStatus + "\"";
    jsonPayload += "}";

    Serial.println("\n--- Sending to Dashboard ---");
    Serial.print("Server: ");
    Serial.print(dashboardServerAddress);
    Serial.print(":");
    Serial.println(dashboardPort);
    Serial.print("Payload: ");
    Serial.println(jsonPayload);

    // Send POST request
    dashboardClient.post("/api/sensor-data", "application/json", jsonPayload);

    // Get response
    int statusCode = dashboardClient.responseStatusCode();
    String response = dashboardClient.responseBody();

    Serial.print("Response Status: ");
    Serial.println(statusCode);

    if (statusCode == 201 || statusCode == 200) {
      Serial.println("✓ Data sent to Dashboard successfully!");
    } else {
      Serial.print("✗ Dashboard error: ");
      Serial.println(response);
    }
    Serial.println("----------------------------\n");

  } catch (Exception e) {
    Serial.print("Error sending to dashboard: ");
    Serial.println(e.what());
  }
}

// ============================================
// SETUP
// ============================================
void setup() {
  Serial.begin(9600);
  delay(2000);

  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║  Arduino IoT Dashboard + Blynk Node   ║");
  Serial.println("╚════════════════════════════════════════╝\n");

  // Initialize DHT sensor
  dht.begin();
  delay(2000);

  // Connect to Blynk
  Serial.println("Connecting to Blynk...");
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);

  Serial.println("✓ Setup complete. Starting sensor readings...\n");
}

// ============================================
// MAIN LOOP
// ============================================
void loop() {
  // Keep Blynk connection alive
  if (Blynk.connected()) {
    Blynk.run();
  }

  // Read DHT22 sensor
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Read battery voltage from A0
  int raw = analogRead(A0);
  float vA0 = (raw / ADC_RESOLUTION) * VREF;
  float batteryVoltage = vA0 * 2.0;
  float percentage = ((batteryVoltage - 1.0) / (1.5 - 1.0)) * 100;

  // Constrain battery percentage
  if (percentage > 100) percentage = 100;
  if (percentage < 0) percentage = 0;

  // Check for sensor read errors
  if (isnan(h) || isnan(t)) {
    Serial.println("✗ DHT22 Sensor read failed");
    delay(2000);
    return;
  }

  // Store latest temperature in array for averaging
  readings[idx] = t;
  idx++;
  if (idx >= 10) {
    idx = 0;
    filled = true;
  }

  // Calculate average temperature and threshold
  float avgTemp = getAverage();
  float threshold = avgTemp + 2.0;

  // Detect events (temperature spike > 1.5°C)
  bool eventDetected = false;
  if (!firstReading) {
    if ((filled && t > threshold) || fabs(t - previousTemp) > 1.5) {
      eventDetected = true;
    }
  }

  // Determine battery status
  String batteryStatus;
  unsigned long sendInterval;

  if (percentage > 70) {
    batteryStatus = "FULL";
    sendInterval = 3000;  // Send every 3 seconds
  } else if (percentage > 40) {
    batteryStatus = "MEDIUM";
    sendInterval = 6000;  // Send every 6 seconds
  } else {
    batteryStatus = "LOW";
    sendInterval = 10000; // Send every 10 seconds
  }

  String eventStatus = eventDetected ? "EVENT DETECTED" : "NORMAL";

  // Battery-aware transmission logic
  unsigned long currentMillis = millis();
  bool shouldSend = false;

  if (percentage > 70) {
    // FULL: send every 3 sec
    if (currentMillis - lastSendTime >= sendInterval) {
      shouldSend = true;
    }
  } else if (percentage > 40) {
    // MEDIUM: send every 6 sec
    if (currentMillis - lastSendTime >= sendInterval) {
      shouldSend = true;
    }
  } else {
    // LOW: send only on event OR every 10 sec
    if (eventDetected || (currentMillis - lastSendTime >= sendInterval)) {
      shouldSend = true;
    }
  }

  // Display current readings
  Serial.print("Temp: ");
  Serial.print(t, 2);
  Serial.print("°C | Humidity: ");
  Serial.print(h, 2);
  Serial.print("% | Threshold: ");
  Serial.print(threshold, 2);
  Serial.print("°C | Battery: ");
  Serial.print(percentage, 1);
  Serial.print("% (");
  Serial.print(batteryStatus);
  Serial.print(") | Event: ");
  Serial.println(eventStatus);

  // Send data if interval reached
  if (shouldSend) {
    Serial.println("\n>>> SENDING DATA <<<");

    // Send to Blynk
    if (Blynk.connected()) {
      Blynk.virtualWrite(V0, t);
      Blynk.virtualWrite(V1, h);
      Blynk.virtualWrite(V2, threshold);
      Blynk.virtualWrite(V3, percentage);
      Blynk.virtualWrite(V4, batteryStatus);
      Blynk.virtualWrite(V5, eventStatus);
      Serial.println("✓ Sent to Blynk");
    } else {
      Serial.println("✗ Blynk not connected");
    }

    // Send to Dashboard Backend
    sendToDashboard(t, h, threshold, percentage, batteryStatus, eventStatus);

    lastSendTime = currentMillis;
  }

  previousTemp = t;
  firstReading = false;

  delay(1000);
}
