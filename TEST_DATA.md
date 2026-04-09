# Testing the IoT Dashboard

Complete guide to test all features without Arduino hardware.

## 🧪 Test Scenarios

### Scenario 1: Single Data Point

Send one sensor reading:

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

**Expected Response:**
```json
{
  "success": true,
  "message": "Sensor data stored successfully",
  "id": 1
}
```

---

### Scenario 2: Multiple Readings (Simulate Time Series)

Run this script to send 10 readings with varying values:

**Windows (PowerShell):**
```powershell
for ($i = 1; $i -le 10; $i++) {
    $temp = 20 + ($i * 0.5)
    $humidity = 50 + ($i * 2)
    $battery = 100 - ($i * 3)
    
    $json = @{
        temperature = $temp
        humidity = $humidity
        threshold_value = $temp + 2
        battery_percentage = $battery
        battery_status = if ($battery -gt 66) { "FULL" } elseif ($battery -gt 33) { "MEDIUM" } else { "LOW" }
        event_status = if ($i % 3 -eq 0) { "EVENT DETECTED" } else { "NORMAL" }
    } | ConvertTo-Json
    
    Invoke-WebRequest -Uri "http://localhost:3000/api/sensor-data" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $json
    
    Start-Sleep -Seconds 1
}
```

**Mac/Linux (Bash):**
```bash
for i in {1..10}; do
  temp=$(echo "20 + $i * 0.5" | bc)
  humidity=$(echo "50 + $i * 2" | bc)
  battery=$(echo "100 - $i * 3" | bc)
  
  if [ $((i % 3)) -eq 0 ]; then
    event="EVENT DETECTED"
  else
    event="NORMAL"
  fi
  
  curl -X POST http://localhost:3000/api/sensor-data \
    -H "Content-Type: application/json" \
    -d "{
      \"temperature\": $temp,
      \"humidity\": $humidity,
      \"threshold_value\": $(echo "$temp + 2" | bc),
      \"battery_percentage\": $battery,
      \"battery_status\": \"FULL\",
      \"event_status\": \"$event\"
    }"
  
  sleep 1
done
```

---

### Scenario 3: Test Battery Status Transitions

Send readings with different battery levels:

```bash
# FULL Battery
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.0,
    "humidity": 60.0,
    "threshold_value": 27.0,
    "battery_percentage": 95.0,
    "battery_status": "FULL",
    "event_status": "NORMAL"
  }'

# MEDIUM Battery
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.0,
    "humidity": 60.0,
    "threshold_value": 27.0,
    "battery_percentage": 50.0,
    "battery_status": "MEDIUM",
    "event_status": "NORMAL"
  }'

# LOW Battery
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.0,
    "humidity": 60.0,
    "threshold_value": 27.0,
    "battery_percentage": 15.0,
    "battery_status": "LOW",
    "event_status": "NORMAL"
  }'
```

---

### Scenario 4: Test Event Detection

Send readings with event status:

```bash
# Normal Event
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.0,
    "humidity": 60.0,
    "threshold_value": 27.0,
    "battery_percentage": 80.0,
    "battery_status": "FULL",
    "event_status": "NORMAL"
  }'

# Event Detected
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 35.0,
    "humidity": 75.0,
    "threshold_value": 27.0,
    "battery_percentage": 80.0,
    "battery_status": "FULL",
    "event_status": "EVENT DETECTED"
  }'
```

---

### Scenario 5: Test Temperature Extremes

Send readings with extreme temperatures:

```bash
# Very Cold
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": -10.5,
    "humidity": 30.0,
    "threshold_value": 0.0,
    "battery_percentage": 70.0,
    "battery_status": "FULL",
    "event_status": "NORMAL"
  }'

# Very Hot
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 45.5,
    "humidity": 85.0,
    "threshold_value": 40.0,
    "battery_percentage": 70.0,
    "battery_status": "FULL",
    "event_status": "EVENT DETECTED"
  }'
```

---

## 📡 API Testing

### Test 1: Get Latest Reading

```bash
curl http://localhost:3000/api/latest
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "temperature": 25.5,
    "humidity": 60.0,
    "threshold_value": 28.0,
    "battery_percentage": 85.0,
    "battery_status": "FULL",
    "event_status": "NORMAL",
    "created_at": "2024-01-15T10:30:45.000Z"
  }
}
```

---

### Test 2: Get History (Last 50)

```bash
curl http://localhost:3000/api/history
```

**Expected Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    { /* reading 1 */ },
    { /* reading 2 */ },
    ...
  ]
}
```

---

### Test 3: Get Statistics

```bash
curl http://localhost:3000/api/stats
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total_readings": 10,
    "avg_temperature": 25.5,
    "max_temperature": 35.0,
    "min_temperature": 20.0,
    "avg_humidity": 62.5,
    "max_humidity": 85.0,
    "min_humidity": 30.0,
    "avg_battery": 75.0,
    "event_count": 2
  }
}
```

---

### Test 4: Health Check

```bash
curl http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:45.000Z"
}
```

---

## ❌ Error Testing

### Test 1: Missing Required Fields

```bash
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.0
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Missing required fields: temperature, humidity, threshold_value, battery_percentage, battery_status, event_status"
}
```

---

### Test 2: Invalid Data Type

```bash
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": "not a number",
    "humidity": 60.0,
    "threshold_value": 28.0,
    "battery_percentage": 85.0,
    "battery_status": "FULL",
    "event_status": "NORMAL"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Invalid data types. All numeric fields must be numbers."
}
```

---

### Test 3: Invalid Battery Percentage

```bash
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.0,
    "humidity": 60.0,
    "threshold_value": 28.0,
    "battery_percentage": 150.0,
    "battery_status": "FULL",
    "event_status": "NORMAL"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Battery percentage must be between 0 and 100"
}
```

---

### Test 4: Invalid Endpoint

```bash
curl http://localhost:3000/api/invalid-endpoint
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Endpoint not found"
}
```

---

## 🎯 Dashboard Verification Checklist

After sending test data, verify on dashboard:

- [ ] **Live Data Cards** show correct values
- [ ] **Temperature Card** displays latest temperature
- [ ] **Humidity Card** displays latest humidity
- [ ] **Threshold Card** displays latest threshold
- [ ] **Battery Card** displays battery percentage
- [ ] **Battery Status** shows correct badge (FULL/MEDIUM/LOW)
- [ ] **Event Status** shows correct badge (NORMAL/EVENT DETECTED)
- [ ] **Temperature Chart** shows trend line
- [ ] **Humidity Chart** shows trend line
- [ ] **Battery Chart** shows trend line
- [ ] **Threshold Chart** shows trend line
- [ ] **Recent Readings Table** shows all sent data
- [ ] **Statistics** show correct totals and averages
- [ ] **Connection Status** shows "Connected"
- [ ] **Last Update** time updates every 2 seconds

---

## 📊 Database Verification

Check data in MySQL:

```sql
-- Connect to database
mysql -u root -p iot_microproject

-- View all readings
SELECT * FROM sensor_readings;

-- Count total readings
SELECT COUNT(*) FROM sensor_readings;

-- View latest reading
SELECT * FROM sensor_readings ORDER BY created_at DESC LIMIT 1;

-- View readings from last hour
SELECT * FROM sensor_readings 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY created_at DESC;

-- Get statistics
SELECT 
  COUNT(*) as total,
  AVG(temperature) as avg_temp,
  MAX(temperature) as max_temp,
  MIN(temperature) as min_temp,
  AVG(humidity) as avg_humidity,
  AVG(battery_percentage) as avg_battery
FROM sensor_readings;
```

---

## 🔄 Continuous Testing

Run this to send data every 5 seconds (simulating Arduino):

**Windows (PowerShell):**
```powershell
while ($true) {
    $temp = 20 + (Get-Random -Minimum 0 -Maximum 10)
    $humidity = 50 + (Get-Random -Minimum 0 -Maximum 20)
    $battery = 50 + (Get-Random -Minimum 0 -Maximum 50)
    
    $json = @{
        temperature = $temp
        humidity = $humidity
        threshold_value = $temp + 2
        battery_percentage = $battery
        battery_status = if ($battery -gt 66) { "FULL" } elseif ($battery -gt 33) { "MEDIUM" } else { "LOW" }
        event_status = if ((Get-Random -Minimum 0 -Maximum 10) -gt 7) { "EVENT DETECTED" } else { "NORMAL" }
    } | ConvertTo-Json
    
    Invoke-WebRequest -Uri "http://localhost:3000/api/sensor-data" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $json | Out-Null
    
    Write-Host "Sent: Temp=$temp, Humidity=$humidity, Battery=$battery"
    Start-Sleep -Seconds 5
}
```

**Mac/Linux (Bash):**
```bash
while true; do
  temp=$((20 + RANDOM % 10))
  humidity=$((50 + RANDOM % 20))
  battery=$((50 + RANDOM % 50))
  
  if [ $((RANDOM % 10)) -gt 7 ]; then
    event="EVENT DETECTED"
  else
    event="NORMAL"
  fi
  
  curl -X POST http://localhost:3000/api/sensor-data \
    -H "Content-Type: application/json" \
    -d "{
      \"temperature\": $temp,
      \"humidity\": $humidity,
      \"threshold_value\": $((temp + 2)),
      \"battery_percentage\": $battery,
      \"battery_status\": \"FULL\",
      \"event_status\": \"$event\"
    }" 2>/dev/null
  
  echo "Sent: Temp=$temp, Humidity=$humidity, Battery=$battery"
  sleep 5
done
```

---

## ✅ Test Results

Document your test results:

| Test | Status | Notes |
|------|--------|-------|
| Single data point | ✓ | Data appears on dashboard |
| Multiple readings | ✓ | Charts update correctly |
| Battery transitions | ✓ | Status badges change |
| Event detection | ✓ | Event badge shows |
| Temperature extremes | ✓ | Charts handle range |
| API endpoints | ✓ | All return correct data |
| Error handling | ✓ | Validation works |
| Database storage | ✓ | Data persists |
| Dashboard refresh | ✓ | Updates every 2 seconds |

---

**All tests passing? You're ready for Arduino! 🎉**
