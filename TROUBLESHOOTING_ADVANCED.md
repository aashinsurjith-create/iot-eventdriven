# Advanced Troubleshooting Guide

Comprehensive troubleshooting for complex issues.

---

## 🔍 Diagnostic Tools

### Check Server Status

```bash
# Check if server is running
curl http://localhost:3000/api/health

# Check with verbose output
curl -v http://localhost:3000/api/health
```

### Check Database Connection

```bash
# Test MySQL connection
mysql -u root -p -e "SELECT 1;"

# Check database exists
mysql -u root -p -e "USE iot_microproject; SHOW TABLES;"

# Check table structure
mysql -u root -p iot_microproject -e "DESCRIBE sensor_readings;"
```

### Check Node.js

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check installed packages
npm list
```

### Check Ports

**Windows:**
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :3306
```

**Mac/Linux:**
```bash
lsof -i :3000
lsof -i :3306
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module 'express'"

**Symptoms:**
```
Error: Cannot find module 'express'
```

**Solutions:**
1. Install dependencies:
   ```bash
   npm install
   ```

2. Check package.json exists:
   ```bash
   ls -la package.json
   ```

3. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

4. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### Issue 2: "EADDRINUSE: address already in use :::3000"

**Symptoms:**
```
Error: listen EADDRINUSE :::3000
```

**Solutions:**
1. Kill process using port 3000:
   
   **Windows:**
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```
   
   **Mac/Linux:**
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. Change port in server.js:
   ```javascript
   const PORT = 3001;  // Change from 3000
   ```

3. Use different port:
   ```bash
   PORT=3001 npm start
   ```

---

### Issue 3: "Connection refused" (MySQL)

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions:**
1. Start MySQL service:
   
   **Windows:**
   ```bash
   net start MySQL80
   ```
   
   **Mac:**
   ```bash
   brew services start mysql
   ```
   
   **Linux:**
   ```bash
   sudo systemctl start mysql
   ```

2. Check MySQL is running:
   ```bash
   mysql -u root -p
   ```

3. Verify credentials in db.js:
   ```javascript
   user: 'root',
   password: '',  // Your password
   ```

4. Check MySQL port:
   ```bash
   mysql -u root -p -h 127.0.0.1 -P 3306
   ```

---

### Issue 4: "Database does not exist"

**Symptoms:**
```
Error: Unknown database 'iot_microproject'
```

**Solutions:**
1. Create database:
   ```bash
   mysql -u root -p < schema.sql
   ```

2. Verify database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

3. Check schema.sql file:
   ```bash
   cat schema.sql
   ```

4. Manually create database:
   ```bash
   mysql -u root -p
   CREATE DATABASE iot_microproject;
   USE iot_microproject;
   SOURCE schema.sql;
   ```

---

### Issue 5: "No data available" on dashboard

**Symptoms:**
- Dashboard loads but shows no data
- Cards show "--"
- Charts are empty

**Solutions:**
1. Send test data:
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

2. Check database has data:
   ```bash
   mysql -u root -p iot_microproject -e "SELECT COUNT(*) FROM sensor_readings;"
   ```

3. Check API endpoint:
   ```bash
   curl http://localhost:3000/api/latest
   ```

4. Check browser console (F12):
   - Look for JavaScript errors
   - Check Network tab for failed requests

5. Check server console:
   - Look for error messages
   - Check if data is being received

---

### Issue 6: "Arduino can't connect to server"

**Symptoms:**
- Arduino Serial Monitor shows connection errors
- "Failed to connect" messages
- No data appears on dashboard

**Solutions:**
1. Verify WiFi connection:
   ```cpp
   // Check in Arduino Serial Monitor
   Serial.println(WiFi.status());
   // Should print: 3 (WL_CONNECTED)
   ```

2. Check server IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
   
   Update in Arduino code:
   ```cpp
   const char* serverAddress = "192.168.1.100";  // Your IP
   ```

3. Verify firewall allows port 3000:
   - Windows: Windows Defender Firewall → Allow an app
   - Mac: System Preferences → Security & Privacy → Firewall
   - Linux: `sudo ufw allow 3000`

4. Test connectivity from Arduino:
   ```cpp
   WiFiClient testClient;
   if (testClient.connect("192.168.1.100", 3000)) {
     Serial.println("Connected!");
   } else {
     Serial.println("Failed to connect");
   }
   ```

5. Check network connectivity:
   ```bash
   # From Arduino's network
   ping 192.168.1.100
   ```

---

### Issue 7: "Charts not updating"

**Symptoms:**
- Dashboard loads
- Data appears in cards
- Charts remain empty

**Solutions:**
1. Refresh page:
   ```
   Ctrl+R (Windows/Linux)
   Cmd+R (Mac)
   ```

2. Clear browser cache:
   - F12 → Application → Clear Storage
   - Or use Ctrl+Shift+Delete

3. Check browser console (F12):
   - Look for Chart.js errors
   - Check for JavaScript errors

4. Verify data in database:
   ```bash
   mysql -u root -p iot_microproject -e "SELECT * FROM sensor_readings LIMIT 5;"
   ```

5. Check API response:
   ```bash
   curl http://localhost:3000/api/history
   ```

6. Restart server:
   ```bash
   # Stop: Ctrl+C
   npm start
   ```

---

### Issue 8: "Slow dashboard performance"

**Symptoms:**
- Dashboard takes long to load
- Charts update slowly
- API responses are slow

**Solutions:**
1. Check database size:
   ```bash
   mysql -u root -p iot_microproject -e "SELECT COUNT(*) FROM sensor_readings;"
   ```

2. Add database indexes:
   ```sql
   CREATE INDEX idx_created_at ON sensor_readings(created_at);
   CREATE INDEX idx_temperature ON sensor_readings(temperature);
   ```

3. Limit data returned:
   ```javascript
   // In server.js, limit history
   LIMIT 50  // Instead of 1000
   ```

4. Reduce refresh rate:
   ```javascript
   // In public/script.js
   const REFRESH_INTERVAL = 5000;  // 5 seconds instead of 2
   ```

5. Archive old data:
   ```sql
   -- Move old data to archive table
   INSERT INTO sensor_readings_archive 
   SELECT * FROM sensor_readings 
   WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
   
   DELETE FROM sensor_readings 
   WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
   ```

---

### Issue 9: "CORS errors"

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. CORS is already enabled in server.js:
   ```javascript
   app.use(cors());
   ```

2. If still having issues, check:
   ```javascript
   app.use(cors({
     origin: '*',
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     credentials: true
   }));
   ```

3. Check browser console for exact error
4. Verify API endpoint is correct
5. Check request headers

---

### Issue 10: "Memory leak / Server crashes"

**Symptoms:**
- Server crashes after running for a while
- Memory usage keeps increasing
- "Out of memory" errors

**Solutions:**
1. Check memory usage:
   ```bash
   # Windows
   tasklist | findstr node
   
   # Mac/Linux
   ps aux | grep node
   ```

2. Ensure connections are released:
   ```javascript
   // In server.js, always release connections
   connection.release();
   ```

3. Limit connection pool:
   ```javascript
   connectionLimit: 10,  // Don't exceed this
   ```

4. Add connection timeout:
   ```javascript
   enableKeepAlive: true,
   keepAliveInitialDelaySeconds: 0
   ```

5. Monitor with PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 monit
   ```

---

## 🔧 Advanced Debugging

### Enable Debug Logging

Edit `server.js`:

```javascript
// Add at top
const debug = require('debug')('iot-dashboard');

// Use in code
debug('Server started');
debug('Data received:', req.body);
debug('Database query:', query);
```

Run with debug:
```bash
DEBUG=iot-dashboard npm start
```

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Check each request:
   - Status code (should be 200)
   - Response time
   - Response body

### Monitor Database Queries

```bash
# Enable MySQL query logging
mysql -u root -p

SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';

# View logs
SELECT * FROM mysql.general_log;

# Disable when done
SET GLOBAL general_log = 'OFF';
```

### Test API Endpoints Individually

```bash
# Test POST
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature":25,"humidity":60,"threshold_value":28,"battery_percentage":85,"battery_status":"FULL","event_status":"NORMAL"}'

# Test GET latest
curl http://localhost:3000/api/latest

# Test GET history
curl http://localhost:3000/api/history

# Test GET stats
curl http://localhost:3000/api/stats

# Test health
curl http://localhost:3000/api/health
```

---

## 📊 Performance Profiling

### Profile Node.js

```bash
npm install -g clinic
clinic doctor -- node server.js
```

### Profile Database

```sql
-- Find slow queries
SELECT * FROM mysql.slow_log;

-- Check query execution plan
EXPLAIN SELECT * FROM sensor_readings ORDER BY created_at DESC LIMIT 50;
```

---

## 🔐 Security Debugging

### Check for SQL Injection

Test with:
```bash
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature":"1; DROP TABLE sensor_readings;","humidity":60,"threshold_value":28,"battery_percentage":85,"battery_status":"FULL","event_status":"NORMAL"}'
```

Should return error, not execute query.

### Check for XSS

Test with:
```bash
curl -X POST http://localhost:3000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"temperature":25,"humidity":60,"threshold_value":28,"battery_percentage":85,"battery_status":"<script>alert(1)</script>","event_status":"NORMAL"}'
```

Should sanitize or reject.

---

## 📝 Logging Best Practices

### Add Comprehensive Logging

```javascript
// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Log errors
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message });
});
```

### Save Logs to File

```javascript
const fs = require('fs');
const logStream = fs.createWriteStream('server.log', { flags: 'a' });

app.use((req, res, next) => {
  logStream.write(`${new Date().toISOString()} - ${req.method} ${req.path}\n`);
  next();
});
```

---

## 🆘 When All Else Fails

1. **Restart everything:**
   ```bash
   # Stop server (Ctrl+C)
   # Stop MySQL
   # Clear browser cache
   # Restart MySQL
   # Restart server
   ```

2. **Reset database:**
   ```bash
   mysql -u root -p -e "DROP DATABASE iot_microproject;"
   mysql -u root -p < schema.sql
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Check logs:**
   - Server console output
   - Browser console (F12)
   - MySQL error log
   - System event log

5. **Verify setup:**
   - Node.js installed
   - MySQL running
   - Database created
   - All files present

---

## 📞 Getting Help

1. Check this guide first
2. Check README.md
3. Check browser console (F12)
4. Check server console
5. Check MySQL logs
6. Search online for error message
7. Ask in forums/communities

---

## ✅ Troubleshooting Checklist

- [ ] Checked error messages carefully
- [ ] Restarted server
- [ ] Restarted MySQL
- [ ] Cleared browser cache
- [ ] Verified all files exist
- [ ] Checked database connection
- [ ] Tested API endpoints
- [ ] Checked browser console
- [ ] Checked server console
- [ ] Verified network connectivity

---

**Still stuck? Check the logs and error messages carefully - they usually tell you exactly what's wrong! 🔍**
