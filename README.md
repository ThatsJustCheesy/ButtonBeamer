# ButtonBeamer

## Technically,

ButtonBeamer is a webpage that beams your keyboard input to a server, translates it into WiimoteEmulator commands, and relays it to an existing WiimoteEmulator process.

## Practically,

ButtonBeamer is the front half of a Wii remote control app. The back half is [rnconrad/WiimoteEmulator](https://github.com/rnconrad/WiimoteEmulator).

## How to use

### Prerequisites

* Wii console (Wii Us don't work at the moment)
* Basic command-line skills
* Linux system with Bluetooth hardware and Node.js installed
* To use over the Internet, a forwarded IPv4 port

### Instructions

* Create/navigate to an appropriate scratch space directory.
* `git clone --depth=1 https://github.com/ThatsJustCheesy/ButtonBeamer`
* `git clone --depth=1 -b socket-input https://github.com/ThatsJustCheesy/WiimoteEmulator`
* `cd WiimoteEmulator` and set up WiimoteEmulator as per [the instructions](https://github.com/rnconrad/WiimoteEmulator#buildinstall). Pair it with your Wii console and note down the Wii's Bluetooth address.
* Run `./wmemulator <wii-bluetooth-address> unix /tmp/wmemulator_input`
* Go to the ButtonBeamer directory (`cd ../ButtonBeamer`).
* `npm install`
* Choose a port to run on, e.g., `8080`. Then run `export PORT=<your-port> OUTPUT_SOCKET_PATH=/tmp/wmemulator_input`, or put each assignment on a separate line in a file named `.env`.
* `npm start`
* Navigate to `http://<your-hostname>:<your-port>`. To access the page from the machine it's hosted on, `<your-hostname>` is `localhost`; otherwise, it's the local IP address of the host machine.
* Click in the blue region at the top of the page, and (for instance) use arrow keys to move the Classic Controller cursor. (The controls are presently hardcoded to an MKWii configuration, which you can view in [keycode_to_message.js](keycode_to_message.js).)

## Is it broken? Have a suggestion?

Please file a detailed GitHub issue.

