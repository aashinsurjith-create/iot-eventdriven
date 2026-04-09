# API Examples & Integration Guide

Complete examples for integrating with the IoT Dashboard API.

---

## 🔗 Base URL

```
http://localhost:3000/api
```

For remote access, replace `localhost` with your server IP or domain.

---

## 📡 POST /api/sensor-data

Send sensor data to the dashboard.

### Request

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

### JavaScript Example

```javascript
async function sendSensorData(data) {
  try {
    const response = await fetch('http://localhost:3000/api/sensor-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        temperature: data.temp,
        humidity: data.humidity,
        threshold_value: data.threshold,
        battery_percentage: data.battery,
        battery_status: data.batteryStatus,
        event_status: data.eventStatus
      })
    });

    const result = await response.json();
    console.log('Response:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
sendSensorData({
  temp: 25.5,
  humidity: 60.0,
  threshold: 28.0,
  battery: 85.0,
  batteryStatus: 'FULL',
  eventStatus: 'NORMAL'
});
```

### Python Example

```python
import requests
import json

def send_sensor_data(temperature, humidity, threshold, battery, battery_status, event_status):
    url = 'http://localhost:3000/api/sensor-data'
    
    data = {
        'temperature': temperature,
        'humidity': humidity,
        'threshold_value': threshold,
        'battery_percentage': battery,
        'battery_status': battery_status,
        'event_status': event_status
    }
    
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, json=data, headers=headers)
        result = response.json()
        print(f"Status: {response.status_code}")
        print(f"Response: {result}")
        return result
    except Exception as e:
        print(f"Error: {e}")

# Usage
send_sensor_data(25.5, 60.0, 28.0, 85.0, 'FULL', 'NORMAL')
```

### Response

**Success (201):**
```json
{
  "success": true,
  "message": "Sensor data stored successfully",
  "id": 1
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Missing required fields: temperature, humidity, threshold_value, battery_percentage, battery_status, event_status"
}
```

### Required Fields

| Field | Type | Range | Example |
|-------|------|-------|---------|
| temperature | number | -50 to 150 | 25.5 |
| humidity | number | 0 to 100 | 60.0 |
| threshold_value | number | any | 28.0 |
| battery_percentage | number | 0 to 100 | 85.0 |
| battery_status | string | FULL, MEDIUM, LOW | "FULL" |
| event_status | string | NORMAL, EVENT DETECTED | "NORMAL" |

---

## 📖 GET /api/latest

Get the most recent sensor reading.

### Request

```bash
curl http://localhost:3000/api/latest
```

### JavaScript Example

```javascript
async function getLatestReading() {
  try {
    const response = await fetch('http://localhost:3000/api/latest');
    const result = await response.json();
    
    if (result.success) {
      console.log('Latest reading:', result.data);
      console.log('Temperature:', result.data.temperature);
      console.log('Humidity:', result.data.humidity);
    }
    
    return result.data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
getLatestReading();
```

### Python Example

```python
import requests

def get_latest_reading():
    url = 'http://localhos