# Step-by-Step Upload Guide - Follow Exactly

Complete visual guide to upload your Arduino code and see data on dashboard.

---

## 🎯 What You Have Ready

✅ Arduino code: ARDUINO_CODE.ino (with IP: 10.148.26.208)
✅ Backend server: Running on http://localhost:3000
✅ Dashboard: Ready at http://localhost:3000
✅ MySQL database: Connected

---

## 📋 STEP 1: Install ArduinoHttpClient Library

**Time: 2 minutes**

### 1.1 Open Arduino IDE
- Click Arduino IDE icon on desktop or taskbar

### 1.2 Go to Library Manager
- Click menu: **Sketch**
- Click: **Include Library**
- Click: **Manage Libraries**

### 1.3 Search for Library
- In the search box at top, type: `ArduinoHttpClient`
- Wait for results to load

### 1.4 Install Library
- Find "ArduinoHttpClient" by Arduino
- Click the **Install** button
- Wait for "Installation completed" message
- Close the Library Manager window

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
    ↓
Wait for completion
```

---

## 📤 STEP 2: Connect Arduino to Computer

**Time: 1 minute**

### 2.1 Get USB Cable
- Use the USB cable that came with Arduino

### 2.2 Connect Arduino
- Plug USB cable into Arduino UNO R4 WiFi
- Plug other end into computer USB port
- Wait 2 seconds for connection

### 2.3 Verify Connection
- Arduino should show green light
- Computer should recognize device

---

## 🔧 STEP 3: Open Arduino Code

**Time: 1 minute**

### 3.1 Open File
- In Arduino IDE, click: **File**
- Click: **Open**
- Navigate to: `ARDUINO_CODE.ino`
- Click **Open**

### 3.2 Verify Code
- You should see the code in the editor
- Look for line with: `const char* dashboardServerAddress = "10.148.26.208";`
- This is your IP address (correct!)

---

## ⚙️ STEP 4: Select Board

**Time: 1 minute**

### 4.1 Open Tools Menu
- Click: **Tools** menu

### 4.2 Select Board
- Click: **Board**
- Look for: **Arduino UNO R4 WiFi**
- Click it

### 4.3 Verify Selection
- You should see checkmark next to "Arduino UNO R4 WiFi"

---

## 🔌 STEP 5: Select Port

**Time: 1 minute**

### 5.1 Open Tools Menu
- Click: **Tools** menu

### 5.2 Select Port
- Click: **Port**
- You should see: **COM3** or **COM4** (or similar)
- Next to it should say: "Arduino UNO R4 WiFi"
- Click it

### 5.3 Verify Selection
- You should see checkmark next to your port

---

## 📤 STEP 6: Upload Code

**Time: 3 minutes**

### 6.1 Click Upload Button
- Look for the **→** (arrow) button in toolbar
- Click it
- This is the Upload button

### 6.2 Wait for Upload
- You should see messages in bottom window:
  ```
  Compiling sketch...
  Uploading...
  ```

### 6.3 Wait for Completion
- Wait for message: **"Done uploading"**
- This takes about 10-15 seconds

### 6.4 If Upload Fails
- Check board is "Arduino UNO R4 WiFi"
- Check port is selected
- Try again

---

## 🔍 STEP 7: Open Serial Monitor

**Time: 2 minutes**

### 7.1 Open Serial Monitor
- Click: **Tools** menu
- Click: **Serial Monitor**
- A new window opens

### 7.2 Set Baud Rate
- Bottom right of Serial Monitor window
- Change dropdown to: **9600**

### 7.3 Watch for Output
- Within 5 seconds, you should see:

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

### 7.4 If No Output
- Check baud rate is 9600
- Check USB cable is connected
- Try different USB port
- Restart Arduino IDE

---

## 📊 STEP 8: Open Dashboard

**Time: 1 minute**

### 8.1 Open Browser
- Open Chrome, Firefox, Safari, or Edge

### 8.2 Go to Dashboard
- In address bar, type: `http://localhost:3000`
- Press Enter

### 8.3 You Should See
- Dashboard with 6 data cards
- Temperature: 25.50°C
- Humidity: 60.20%
- Threshold: 27.50°C
- Battery: 85.0%
- Battery Status: FULL
- Event Status: NORMAL

### 8.4 Watch Updates
- Dashboard updates every 2 seconds
- Watch "Last update" time change
- Charts should show data points
- Table should show recent readings

---

## ✅ STEP 9: Verify Everything Works

**Time: 2 minutes**

### 9.1 Check Serial Monitor
- ✅ Shows sensor readings
- ✅ Shows "✓ Data sent to Dashboard successfully!"
- ✅ Updates every 3-10 seconds

### 9.2 Check Dashboard
- ✅ Shows all 6 data cards
- ✅ Shows correct values
- ✅ Updates every 2 seconds
- ✅ Charts show data
- ✅ Table shows readings

### 9.3 Check Blynk App
- ✅ Open Blynk app on phone
- ✅ Check if values updated
- ✅ Should match Serial Monitor

---

## 🧪 STEP 10: Test Features

**Time: 2 minutes**

### 10.1 Test Temperature Change
- Heat or cool DHT22 sensor
- Serial Monitor shows new temperature
- Dashboard updates within 2 seconds
- Chart shows new data point

### 10.2 Test Event Detection
- Rapidly change temperature (>1.5°C spike)
- Serial Monitor shows "EVENT DETECTED"
- Dashboard shows "EVENT DETECTED"
- Blynk app shows "EVENT DETECTED"

### 10.3 Test Battery Levels
- Simulate low battery (adjust voltage to A0)
- Serial Monitor shows "LOW"
- Send interval increases to 10 seconds
- Dashboard shows "LOW"

---

## 🎉 Success Checklist

- [ ] ArduinoHttpClient library installed
- [ ] Arduino connected to computer
- [ ] Board selected: Arduino UNO R4 WiFi
- [ ] Port selected: COM3 (or your port)
- [ ] Code uploaded successfully
- [ ] Serial Monitor shows sensor readings
- [ ] Serial Monitor shows "✓ Data sent to Dashboard successfully!"
- [ ] Dashboard shows all 6 data cards
- [ ] Dashboard updates every 2 seconds
- [ ] Charts display data
- [ ] Table shows recent readings
- [ ] Blynk app shows updated values

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No Serial output | Check baud rate is 9600 |
| Upload fails | Check board and port selection |
| Dashboard empty | Refresh page (Ctrl+R) |
| Data not sending | Check IP and firewall |
| Blynk not working | Check WiFi connection |

---

## 📞 Need Help?

| Issue | Check |
|-------|-------|
| Can't find library | Search "ArduinoHttpClient" exactly |
| Upload error | Board: Arduino UNO R4 WiFi, Port: COM3 |
| No Serial output | Baud rate: 9600 |
| Dashboard empty | Server running, refresh page |
| Blynk not updating | WiFi connected, app open |

---

## ⏱️ Total Time

- Install library: 2 min
- Connect Arduino: 1 min
- Open code: 1 min
- Select board: 1 min
- Select port: 1 min
- Upload code: 3 min
- Open Serial Monitor: 2 min
- Open Dashboard: 1 min
- Verify: 2 min
- Test: 2 min

**Total: ~16 minutes**

---

## 🎊 What You'll Have

✅ Real-time Dashboard
✅ Blynk Integration
✅ Data Storage
✅ Charts
✅ Battery-Aware Transmission
✅ Event Detection
✅ Professional UI

---

## 🚀 Start Now!

**👉 Begin with STEP 1: Install ArduinoHttpClient Library**

Follow each step in order. You'll have your hardware data on the dashboard in less than 20 minutes!

---

**Your complete IoT system is ready. Let's go! 🎉**
