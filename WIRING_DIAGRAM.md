# Wiring Diagram - Arduino to Sensors

Complete wiring guide with diagrams for connecting sensors to Arduino UNO R4 WiFi.

---

## 🔌 Arduino UNO R4 WiFi Pin Layout

```
                    ┌─────────────────────┐
                    │  Arduino UNO R4     │
                    │      WiFi           │
                    │                     │
        ┌───────────┤ USB                 ├───────────┐
        │           │                     │           │
        │           │  POWER              │           │
        │           ├─────────────────────┤           │
        │           │ GND  5V  3.3V  IOREF│           │
        │           │                     │           │
        │           │  ANALOG INPUTS      │           │
        │           ├─────────────────────┤           │
        │           │ A0   A1   A2   A3   │           │
        │           │ A4   A5   A6   A7   │           │
        │           │                     │           │
        │           │  DIGITAL I/O        │           │
        │           ├─────────────────────┤           │
        │           │ 0    1    2    3    │           │
        │           │ 4    5    6    7    │           │
        │           │ 8    9   10   11    │           │
        │           │12   13   GND  AREF │           │
        │           │                     │           │
        └───────────┤ GND  5V  3.3V  IOREF├───────────┘
                    └─────────────────────┘
```

---

## 📊 Sensor Connection Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Arduino UNO R4 WiFi                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  A0 ←─── Temperature Sensor (Signal)                       │
│  A1 ←─── Humidity Sensor (Signal)                          │
│  A2 ←─── Battery Voltage Sensor (Signal)                   │
│  D2 ←─── Event Button                                      │
│  5V ──→ Sensor Power Supply                                │
│  GND ──→ Ground (All Sensors)                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌡️ Temperature Sensor Wiring

### LM35 Temperature Sensor

```
        LM35 Sensor
        ┌─────────┐
        │ ▲ ▲ ▲   │
        │ 1 2 3   │
        └─────────┘
        │ │ │
        │ │ └─────────────→ GND (Arduino)
        │ └───────────────→ A0 (Arduino)
        └─────────────────→ 5V (Arduino)

Pin 1: VCC (5V)
Pin 2: Signal (A0)
Pin 3: GND
```

### Wiring Steps:
1. Connect Pin 1 (VCC) → Arduino 5V
2. Connect Pin 2 (Signal) → Arduino A0
3. Connect Pin 3 (GND) → Arduino GND

---

## 💧 Humidity Sensor Wiring

### DHT22 / DHT11 Humidity Sensor

```
        DHT Sensor
        ┌─────────┐
        │ ▲ ▲ ▲ ▲ │
        │ 1 2 3 4 │
        └─────────┘
        │ │ │ │
        │ │ │ └─────────────→ GND (Arduino)
        │ │ └───────────────→ A1 (Arduino)
        │ └─────────────────→ 5V (Arduino)
        └─────────────────────→ (Not used)

Pin 1: VCC (5V)
Pin 2: Signal (A1)
Pin 3: Not used
Pin 4: GND
```

### Wiring Steps:
1. Connect Pin 1 (VCC) → Arduino 5V
2. Connect Pin 2 (Signal) → Arduino A1
3. Connect Pin 4 (GND) → Arduino GND

---

## 🔋 Battery Voltage Sensor Wiring

### Voltage Divider Circuit

```
        Battery
        ┌─────┐
        │ +   │
        │     │
        └──┬──┘
           │
           ├─────────────────→ A2 (Arduino)
           │
        ┌──┴──┐
        │ R1  │ (10kΩ)
        │     │
        └──┬──┘
           │
        ┌──┴──┐
        │ R2  │ (10kΩ)
        │     │
        └──┬──┘
           │
        ┌──┴──┐
        │ -   │
        │     │
        └─────┘
           │
           └─────────────────→ GND (Arduino)
```

### Wiring Steps:
1. Battery positive → R1 (10kΩ resistor)
2. R1 → Junction point → A2 (Arduino)
3. Junction point → R2 (10kΩ resistor)
4. R2 → Battery negative → GND (Arduino)

---

## 🔘 Event Button Wiring

### Push Button

```
        Button
        ┌─────┐
        │  ◯  │
        └──┬──┘
           │
        ┌──┴──┐
        │ Pin1│ ──────────────→ D2 (Arduino)
        │     │
        │ Pin2│ ──────────────→ GND (Arduino)
        └─────┘
```

### Wiring Steps:
1. Button Pin 1 → Arduino D2
2. Button Pin 2 → Arduino GND
3. Arduino D2 has internal pull-up resistor

---

## 🔌 Complete Wiring Diagram

```
                    ┌──────────────────────┐
                    │  Arduino UNO R4 WiFi │
                    │                      │
    ┌───────────────┤ 5V                   │
    │               │ GND                  │
    │               │ A0  A1  A2  D2       │
    │               │                      │
    │               └──────────────────────┘
    │                  │   │   │   │
    │                  │   │   │   │
    │                  │   │   │   └─────────────┐
    │                  │   │   │                 │
    │                  │   │   └──────────┐      │
    │                  │   │              │      │
    │                  │   └──────┐       │      │
    │                  │          │       │      │
    │                  │          │       │      │
    │                  ▼          ▼       ▼      ▼
    │            ┌──────────┐ ┌──────┐ ┌────┐ ┌────┐
    │            │ Temp     │ │Humid │ │Batt│ │Btn │
    │            │ Sensor   │ │Sensor│ │Volt│ │    │
    │            │ (LM35)   │ │(DHT) │ │Div │ │    │
    │            └──────────┘ └──────┘ └────┘ └────┘
    │                  │          │       │      │
    │                  │          │       │      │
    └──────────────────┴──────────┴───────┴──────┘
                       │
                       ▼
                      GND
```

---

## 📋 Pin Assignment Summary

| Component | Arduino Pin | Type | Voltage |
|-----------|------------|------|---------|
| Temperature Sensor | A0 | Analog Input | 0-5V |
| Humidity Sensor | A1 | Analog Input | 0-5V |
| Battery Voltage | A2 | Analog Input | 0-5V |
| Event Button | D2 | Digital Input | 0-5V |
| Power Supply | 5V | Power | 5V |
| Ground | GND | Ground | 0V |

---

## 🔧 Sensor Specifications

### Temperature Sensor (LM35)
- **Type**: Analog temperature sensor
- **Range**: -55°C to +150°C
- **Output**: 10mV per °C
- **Pins**: 3 (VCC, Signal, GND)
- **Power**: 5V

### Humidity Sensor (DHT22)
- **Type**: Digital humidity sensor
- **Range**: 0-100% RH
- **Accuracy**: ±2%
- **Pins**: 4 (VCC, Signal, NC, GND)
- **Power**: 5V

### Battery Voltage Sensor
- **Type**: Voltage divider circuit
- **Range**: 0-5V input
- **Resistors**: 2x 10kΩ
- **Output**: 0-5V to Arduino

### Event Button
- **Type**: Momentary push button
- **Pins**: 2
- **Connection**: D2 and GND
- **Pull-up**: Internal (Arduino)

---

## 🧪 Testing Connections

### Test 1: Power Supply
```
1. Connect 5V to Arduino 5V pin
2. Connect GND to Arduino GND pin
3. LED on Arduino should light up
```

### Test 2: Temperature Sensor
```
1. Connect sensor to A0
2. Open Serial Monitor
3. Should see temperature values
4. Heat sensor with hand
5. Value should increase
```

### Test 3: Humidity Sensor
```
1. Connect sensor to A1
2. Open Serial Monitor
3. Should see humidity values
4. Breathe on sensor
5. Value should increase
```

### Test 4: Battery Voltage
```
1. Connect voltage divider to A2
2. Open Serial Monitor
3. Should see battery percentage
4. Adjust voltage input
5. Percentage should change
```

### Test 5: Event Button
```
1. Connect button to D2
2. Open Serial Monitor
3. Press button
4. Should see "EVENT DETECTED"
5. Release button
6. Should see "NORMAL"
```

---

## ⚠️ Important Notes

### Power Supply
- Arduino 5V pin can supply up to 500mA
- If sensors draw more, use external power supply
- Always connect GND from external supply to Arduino GND

### Analog Pins
- Arduino has 8 analog pins (A0-A7)
- Each pin reads 0-1023 (10-bit resolution)
- Voltage range: 0-5V

### Digital Pins
- Arduino has 14 digital pins (D0-D13)
- D0 and D1 are used for Serial communication
- D2 is used for event button

### WiFi
- Arduino UNO R4 WiFi has built-in WiFi module
- Requires 2.4GHz WiFi network
- Cannot connect to 5GHz networks

---

## 🔍 Troubleshooting Connections

### No Serial Output
- Check USB cable connection
- Verify COM port in Arduino IDE
- Check baud rate is 9600

### Sensor Reads 0 or 1023
- Check sensor wiring
- Verify sensor power supply
- Check sensor is on correct pin

### Button Doesn't Work
- Check button wiring
- Verify button is on D2
- Check button polarity

### WiFi Won't Connect
- Check WiFi SSID and password
- Verify WiFi is 2.4GHz
- Check antenna connection

---

## 📸 Visual Reference

### Breadboard Layout Example

```
┌─────────────────────────────────────────┐
│ Breadboard                              │
├─────────────────────────────────────────┤
│                                         │
│  5V ─────────────────────────────────┐  │
│  │                                   │  │
│  ├─ Temp Sensor VCC                  │  │
│  ├─ Humid Sensor VCC                 │  │
│  └─ Battery Divider VCC              │  │
│                                       │  │
│  GND ────────────────────────────────┤  │
│  │                                   │  │
│  ├─ Temp Sensor GND                  │  │
│  ├─ Humid Sensor GND                 │  │
│  ├─ Battery Divider GND              │  │
│  └─ Button GND                       │  │
│                                       │  │
│  A0 ─ Temp Sensor Signal             │  │
│  A1 ─ Humid Sensor Signal            │  │
│  A2 ─ Battery Divider Output         │  │
│  D2 ─ Button Pin                     │  │
│                                       │  │
└─────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

- [ ] All sensors connected to correct pins
- [ ] All sensors have power (5V)
- [ ] All sensors have ground (GND)
- [ ] Button connected to D2 and GND
- [ ] No loose wires
- [ ] No short circuits
- [ ] Arduino recognizes sensors
- [ ] Serial Monitor shows values
- [ ] Dashboard receives data

---

**Your hardware is now properly wired! 🎉**

Next: Upload the Arduino code and verify on dashboard.
