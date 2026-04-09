# Complete Setup Instructions

Step-by-step guide to get your IoT dashboard running.

---

## 🖥️ System Requirements

- **Operating System**: Windows, Mac, or Linux
- **Node.js**: v14 or higher
- **MySQL**: v5.7 or higher
- **Browser**: Chrome, Firefox, Safari, or Edge (any modern browser)
- **Arduino UNO R4 WiFi** (for hardware integration)

---

## 📥 Step 1: Install Node.js

### Windows
1. Go to https://nodejs.org/
2. Download LTS version
3. Run installer
4. Follow installation wizard
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Mac
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm
```

---

## 🗄️ Step 2: Install MySQL

### Windows
1. Go to https://dev.mysql.com/downloads/mysql/
2. Download MySQL Community Server
3. Run installer
4. Choose "Developer Default" setup type
5. Configure MySQL Server (port 3306)
6. Create MySQL user (default: root)
7. Start MySQL service

### Mac
```bash
# Using Homebrew
brew install mysql
brew services start mysql

# Or download from https://dev.mysql.com/downloads/mysql/
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
sudo systemctl start mysql
```

### Verify Installation
```bash
mysql --version
mysql -u root -p
```

---

## 📂 Step 3: Set Up Project Files

### Option A: Using Git (Recommended)
```bash
git clone <repository-url>
cd arduino-iot-dashboard
```

### Option B: Manual Setup
1. Create a folder: `arduino-iot-dashboard`
2. Copy all files into this folder
3. Open terminal/command prompt in this folder

---

## 📦 Step 4: Install Node Dependencies

```bash
npm install
```

This installs:
- express
- mysql2
- cors
- body-parser
- dotenv

**Expected output:**
```
added 50 packages in 5s
```

---

## 🗄️ Step 5: Create MySQL Database

### Option A: Using Command Line (Recommended)

```bash
mysql -u root -p < schema.sql
```

When prompted, enter your MySQL password (or press Enter if no password).

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open File → Open SQL Script
4. Select `schema.sql`
5. Click Execute (⚡ icon)

### Option C: Manual SQL

1. Open MySQL command line:
   ```bash
   mysql -u root -p
   ```

2. Copy and paste the contents of `schema.sql`

### Verify Database Creation

```bash
mysql -u root -p iot_microproject -e "SHOW TABLES;"
```

You should see:
```
+---------------------------+
| Tables_in_iot_microproject |
+---------------------------+
| sensor_readings           |
| daily_summary             |
+---------------------------+
```

---

## 🔧 Step 6: Configure Database Connection (Optional)

If your MySQL setup is different, edit `db.js`:

```javascript
const pool = mysql.createPool({
  host: 'localhost',      // Your MySQL host
  user: 'root',           // Your MySQL username
  password: '',           // Your MySQL password
  database: 'iot_microproject',
  // ... rest stays the same
});
```

---

## 🚀 Step 7: Start the Server

```bash
npm start
```

**Expected output:**
```
╔════════════════════════════════════════╗
║   IoT Dashboard Server Started         ║
╠════════════════════════════════════════╣
║ Server running on: http://localhost:3000  ║
║ Dashboard: http://localhost:3000       ║
║ API Health: http://localhost:3000/api/health ║
╚════════════════════════════════════════╝

✓ MySQL Database connected successfully
```

---

## 🌐 Step 8: Access the Dashboard

Open your browser and go to:
```
http://localhost:3000
```

You should see the dashboard with empty cards (no data yet).

---

## 🧪 Step 9: Test with Sample Data

Open a new terminal and send test data:

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

**Expected response:**
```json
{
  "success": true,
  "message": "Sensor data stored successfully",
  "id": 1
}
```

Refresh the dashboard - you should see data appear!

---

## 🔌 Step 10: Arduino Setup (Optional)

### 10.1: Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address

### 10.2: Update Arduino Code

Edit `ARDUINO_CODE.ino`:

```cpp
// Line 24-25: Update WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";

// Line 28: Update server IP
const char* serverAddress = "192.168.1.100";  // Your computer's IP
```

### 10.3: Install Arduino IDE

1. Download from https://www.arduino.cc/en/software
2. Install and open Arduino IDE
3. Go to Tools → Board → Arduino UNO R4 WiFi
4. Go to Tools → Port → Select your Arduino port

### 10.4: Install Required Libraries

1. Sketch → Include Library → Manage Libraries
2. Search for "ArduinoHttpClient"
3. Click Install

### 10.5: Upload Code

1. Open `ARDUINO_CODE.ino` in Arduino IDE
2. Click Upload (→ button)
3. Wait for "Done uploading" message

### 10.6: Verify Connection

1. Open Serial Monitor (Tools → Serial Monitor)
2. Set baud rate to 9600
3. You should see:
   ```
   ✓ WiFi connected!
   IP Address: 192.168.1.50
   
   Temperature: 25.5 °C
   Humidity: 60.0 %
   ...
   ✓ Data sent successfully!
   ```

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version` works)
- [ ] MySQL installed (`mysql --version` works)
- [ ] npm packages installed (`npm install` completed)
- [ ] Database created (`mysql -u root -p iot_microproject` connects)
- [ ] Server starts (`npm start` shows success message)
- [ ] Dashboard loads (`http://localhost:3000` opens)
- [ ] Test data sends (curl command returns success)
- [ ] Dashboard shows data (refresh page shows values)
- [ ] API endpoints work (curl to `/api/latest` returns data)

---

## 🐛 Troubleshooting

### "npm: command not found"
- Node.js not installed
- Solution: Install Node.js from https://nodejs.org/

### "mysql: command not found"
- MySQL not installed or not in PATH
- Solution: Install MySQL or add to PATH

### "Cannot find module 'express'"
- Dependencies not installed
- Solution: Run `npm install`

### "Connection refused" (MySQL)
- MySQL not running
- Solution: Start MySQL service
  - Windows: `net start MySQL80`
  - Mac: `brew services start mysql`
  - Linux: `sudo systemctl start mysql`

### "Error: listen EADDRINUSE :::3000"
- Port 3000 already in use
- Solution: Change port in `server.js` or kill process using port 3000

### "No data available" on dashboard
- No data sent yet
- Solution: Send test data using curl command

### Arduino can't connect
- Wrong WiFi credentials
- Wrong server IP
- Firewall blocking port 3000
- Solution: Check all three and verify Arduino is on same network

---

## 🔄 Starting Fresh

If you need to reset everything:

### Reset Database
```bash
mysql -u root -p -e "DROP DATABASE iot_microproject;"
mysql -u root -p < schema.sql
```

### Reset Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset Everything
```bash
# Stop server (Ctrl+C)
# Reset database
mysql -u root -p -e "DROP DATABASE iot_microproject;"
mysql -u root -p < schema.sql
# Reset node modules
rm -rf node_modules package-lock.json
npm install
# Start fresh
npm start
```

---

## 📝 Configuration Files

### db.js
Database connection settings. Edit if:
- MySQL username is not "root"
- MySQL password is set
- MySQL host is not "localhost"
- Database name is different

### server.js
Server settings. Edit if:
- Want to change port (default 3000)
- Want to add authentication
- Want to modify API endpoints

### public/script.js
Dashboard settings. Edit if:
- Want to change refresh interval (default 2 seconds)
- Want to modify chart colors
- Want to change API base URL

### ARDUINO_CODE.ino
Arduino settings. Edit if:
- WiFi SSID/password different
- Server IP different
- Sensor pins different
- Send interval different

---

## 🎯 Next Steps

1. ✅ Complete setup (you are here)
2. ✅ Test with sample data (see Step 9)
3. ✅ Upload Arduino code (see Step 10)
4. ✅ Monitor real-time data
5. ✅ Customize as needed

---

## 📞 Getting Help

1. Check README.md for detailed documentation
2. Check QUICKSTART.md for quick reference
3. Check TEST_DATA.md for testing guide
4. Check browser console (F12) for errors
5. Check server console for error messages
6. Check Arduino Serial Monitor for connection issues

---

## 🎉 You're All Set!

Your IoT dashboard is ready to use. Follow the next steps in QUICKSTART.md to start monitoring your Arduino sensors.

**Happy monitoring! 🚀**
