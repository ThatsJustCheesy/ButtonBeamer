# ButtonBeamer

## Technically,

ButtonBeamer is a webpage that beams your keyboard input to a server, translates it into WiimoteEmulator commands, and relays it to an existing WiimoteEmulator process.

## Practically,

ButtonBeamer is the front half of a Wii remote control app. The back half is [rnconrad/WiimoteEmulator](https://github.com/rnconrad/WiimoteEmulator).

## How to use

### Prerequisites

* Wii or Wii U console
* Basic command-line skills
* Linux system with Bluetooth hardware and Node.js installed
* To use over the Internet, a forwarded IPv4 port

### Instructions

* Create/navigate to an appropriate scratch space directory.
* Download ButtonBeamer and WiimoteEmulator: `git clone --recursive --depth=1 --shallow-submodules https://github.com/ThatsJustCheesy/ButtonBeamer`
* `cd ButtonBeamer`
* Install ButtonBeamer's dependencies: `npm install`
* Run this once to install WiimoteEmulator's dependencies with apt and build WiimoteEmulator: `./build.sh install-dependencies`.
  * If you don't use apt, run that anyway, and it will tell you what to install manually. Then re-run as `./build.sh` to actually build.
* Run this before running ButtonBeamer whenever you restart your machine: `./setup.sh`. This starts the custom `bluetoothd` service that WiimoteEmulator requires. To restore your regular `bluetoothd`, run `sudo killall bluetoothd && sudo systemctl start bluetooth`.
* Run `./start.sh ( <wii-bluetooth-address> | pair ) <port>`, substituting arguments as appropriate.
  * The first time, specify `pair`, which has WiimoteEmulator search for a Wii or Wii U console to pair with. In the future, specify your console's Bluetooth address (`<wii-bluetooth-address>`) to connect directly to it.
  * For `<port>`, choose some port to run the web server on, e.g., `8080`.
  * An example `start` command to get you started: `./start.sh pair 8080`.
* Follow WiimoteEmulator's directions and wait for it to connect. Once a connection is established, press Enter to start ButtonBeamer.
* Navigate your browser to `http://<your-hostname>:<the-port-you-chose>`. To access the page from the machine it's hosted on, `<your-hostname>` is `localhost`; otherwise, it's the local IP address of the machine.
* Click in the blue region at the top of the page to beam your input. Use `/help` in the chat window to list all available client commands. In particular, use `/map-list` to see the current list of key-to-input mappings, and use `/map` to add or change them. (The default keymap is for Mario Kart 8.)

## Is it broken? Have a suggestion?

Please file a detailed GitHub issue.

