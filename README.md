
# RGB Strip Remote IR Card

This repository contains a custom Home Assistant card that replicates the functionality of a 44-key RGB strip remote. The card is designed to work with an ESPHome-configured IR transmitter, enabling full control of RGB strip lights through Home Assistant.

---
![image](https://github.com/user-attachments/assets/4bcb695a-1d11-498b-8c8d-7452361c1cbf)

## Features

- **Custom Card for Home Assistant**: A visual interface replicating the 44-key RGB remote.
- **IR Signal Transmission**: Sends the same signals as the original remote via an ESP-based IR transmitter.
- **Complete Control**: Includes power, color, DIY modes, and effect transitions (e.g., fade and jump).
- **Seamless Integration**: Works flawlessly with ESPHome and Home Assistant.

---

## Requirements

1. **Home Assistant**: For hosting the custom card.
2. **ESPHome**: To configure the ESP32/ESP8266 IR transmitter.
3. **IR Transmitter Module**: Connected to the ESP device for sending signals to the RGB strip.

---

## Installation

### 1. Install the Custom Card

1. Clone or download this repository:
   ```bash
   git clone https://github.com/<your-username>/rgb_strip_remote_ir_card.git
   ```
2. Place the card files in the `www` directory of your Home Assistant configuration:
   ```
   config/www/rgb_strip_remote_ir_card.js
   ```
3. Restart Home Assistant to apply the changes.

4. Add the custom card to your **Lovelace UI**:
   - Go to **Dashboard Settings** → **Resources** → Add Resource.
   - Enter the following URL:
     ```
     /local/rgb_strip_remote_ir_card.js
     ```
   - Set the resource type to **JavaScript Module**.

5. Add the card to your dashboard:
   ```yaml
   type: custom:rgb_strip_remote_ir_card
   ```

---

### 2. Configure ESPHome

The ESPHome configuration handles the IR transmission. Add the following code to your ESPHome YAML configuration:

```yaml
esphome:
  name: rgb_strip_ir_transmitter

api:
  services:
    - service: send_ir_signal
      variables:
        command: string
      then:
        - remote_transmitter.transmit_pioneer:
            rc_code_1: !lambda 'return strtol(command.c_str(), NULL, 16);'

# IR Transmitter (sending IR commands)
remote_transmitter:
  pin: GPIO16
  carrier_duty_percent: 50%

# Wi-Fi Configuration
wifi:
  ssid: "your-SSID"
  password: "your-password"

logger:

ota:
```

---

## How It Works

### Custom Card
The custom card provides a fully interactive interface in Home Assistant, replicating all the buttons from the original 44-key remote. The buttons send commands via Home Assistant to the ESPHome device.

### ESPHome Firmware
The ESPHome firmware listens for commands sent via the `send_ir_signal` service. This service receives a hexadecimal string representing the IR code and transmits the corresponding signal.

![image](https://github.com/user-attachments/assets/aacee14e-85ae-4ca9-94cf-c929ca5ff559)

Example service call:
```yaml
service: esphome.rgb_strip_ir_transmitter_send_ir_signal
data:
  command: "0x5C"  # Example IR code
```

---

## File Structure

```
rgb_strip_remote_ir_card/
├── rgb_strip_remote_ir_card.js   # Custom card logic and UI
├── README.md                     # This documentation
```

---

## Contributing

Contributions are welcome! If you find any issues or have suggestions, feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
