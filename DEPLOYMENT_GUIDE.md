# Deployment Guide

Deploy your IoT dashboard to production environments.

---

## 🌐 Deployment Options

### Option 1: Local Network (Recommended for Testing)
- Run on your computer
- Access from other devices on same network
- No internet required
- Perfect for home/office use

### Option 2: Cloud Deployment (Heroku, AWS, DigitalOcean)
- Accessible from anywhere
- Scalable infrastructure
- Requires configuration
- Monthly costs

### Option 3: Raspberry Pi (Always-On)
- Low power consumption
- Always running
- Local network access
- One-time hardware cost

---

## 🏠 Local Network Deployment

### Step 1: Find Your Computer's IP

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

### Step 2: Update Arduino Code

In `ARDUINO_CODE.ino`, change:
```cpp
const char* serverAddress = "192.168.1.100";  // Your computer's IP
```

### Step 3: Access from Other Devices

From any device on your network:
```
http://192.168.1.100:3000
```

### Step 4: Configure Firewall (if needed)

**Windows:**
1. Windows Defender Firewall → Allow an app
2. Add Node.js to allowed apps
3. Allow on Private networks

**Mac:**
1. System Preferences → Security & Privacy
2. Firewall Options
3. Add Node.js to allowed apps

---

## ☁️ Heroku Deployment

### Prerequisites
- Heroku account (https://www.heroku.com/)
- Heroku CLI installed
- Git installed

### Step 1: Create Heroku App

```bash
heroku login
heroku create your-app-name
```

### Step 2: Add MySQL Database

```bash
heroku addons:create cleardb:ignite
```

Get connection string:
```bash
heroku config | grep CLEARDB_DATABASE_URL
```

### Step 3: Update db.js

```javascript
const connectionUrl = process.env.CLEARDB_DATABASE_URL || 'mysql://root@localhost/iot_microproject';
const pool = mysql.createPool(connectionUrl);
```

### Step 4: Update package.json

Add start script:
```json
"scripts": {
  "start": "node server.js"
}
```

### Step 5: Deploy

```bash
git push heroku main
```

### Step 6: Access Dashboard

```
https://your-app-name.herokuapp.com
```

### Step 7: Update Arduino Code

```cpp
const char* serverAddress = "your-app-name.herokuapp.com";
const int port = 80;  // HTTP port
```

---

## 🐳 Docker Deployment

### Step 1: Create Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=iot_microproject
    depends_on:
      - mysql

  mysql:
    image: mysql:5.7
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=iot_microproject
    volumes:
      - ./schema.sql:/docker-entrypoint-initdb.d/schema.sql
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

### Step 3: Run with Docker

```bash
docker-compose up
```

Access at: `http://localhost:3000`

---

## 🍓 Raspberry Pi Deployment

### Prerequisites
- Raspberry Pi 4 (2GB+ RAM)
- Raspberry Pi OS installed
- SSH access enabled

### Step 1: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install MySQL

```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

### Step 3: Clone Project

```bash
git clone <your-repo-url>
cd arduino-iot-dashboard
npm install
```

### Step 4: Create Database

```bash
mysql -u root -p < schema.sql
```

### Step 5: Run as Service

Create `/etc/systemd/system/iot-dashboard.service`:

```ini
[Unit]
Description=Arduino IoT Dashboard
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/arduino-iot-dashboard
ExecStart=/usr/bin/node /home/pi/arduino-iot-dashboard/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl enable iot-dashboard
sudo systemctl start iot-dashboard
```

### Step 6: Find Raspberry Pi IP

```bash
hostname -I
```

### Step 7: Update Arduino Code

```cpp
const char* serverAddress = "192.168.1.50";  // Raspberry Pi IP
```

---

## 🔐 Production Security

### 1. Environment Variables

Create `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=iot_microproject
NODE_ENV=production
PORT=3000
```

Update `db.js`:
```javascript
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

### 2. Add Authentication

```javascript
// Add to server.js
const basicAuth = require('express-basic-auth');

app.use(basicAuth({
  users: { 'admin': 'your_password' },
  challenge: true
}));
```

### 3. HTTPS/SSL

For production, use HTTPS:
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443);
```

### 4. Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

---

## 📊 Database Backup

### Automated Backup Script

Create `backup.sh`:
```bash
#!/bin/bash

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="iot_microproject_$DATE.sql"

mkdir -p $BACKUP_DIR

mysqldump -u root -p iot_microproject > $BACKUP_DIR/$FILENAME

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $FILENAME"
```

### Schedule with Cron

```bash
crontab -e
```

Add:
```
0 2 * * * /path/to/backup.sh
```

---

## 📈 Monitoring & Logging

### Add Logging

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use in code
logger.info('Server started');
logger.error('Database error', error);
```

### Monitor Performance

```bash
npm install pm2
pm2 start server.js
pm2 monit
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

---

## 🧪 Pre-Deployment Checklist

- [ ] All dependencies installed
- [ ] Database created and tested
- [ ] Server starts without errors
- [ ] Dashboard loads correctly
- [ ] API endpoints tested
- [ ] Arduino code updated
- [ ] Environment variables configured
- [ ] Security measures implemented
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Documentation updated
- [ ] Performance tested

---

## 🚀 Deployment Checklist by Platform

### Local Network
- [ ] Find computer IP
- [ ] Update Arduino code with IP
- [ ] Test from other devices
- [ ] Configure firewall

### Heroku
- [ ] Create Heroku account
- [ ] Install Heroku CLI
- [ ] Create app
- [ ] Add database
- [ ] Deploy code
- [ ] Update Arduino code

### Docker
- [ ] Install Docker
- [ ] Create Dockerfile
- [ ] Create docker-compose.yml
- [ ] Build image
- [ ] Run container
- [ ] Test access

### Raspberry Pi
- [ ] Install Node.js
- [ ] Install MySQL
- [ ] Clone project
- [ ] Create database
- [ ] Set up service
- [ ] Find IP address

---

## 📞 Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| Can't access from other devices | Check firewall, verify IP |
| Heroku app crashes | Check logs: `heroku logs --tail` |
| Docker build fails | Check Dockerfile syntax |
| Raspberry Pi slow | Upgrade RAM or optimize queries |
| Database connection fails | Verify credentials and host |

---

## 🎯 Next Steps

1. Choose deployment platform
2. Follow platform-specific steps
3. Test thoroughly
4. Monitor performance
5. Set up backups
6. Document configuration

---

**Ready to deploy! 🚀**
