#!/bin/bash

set -e

function uuid {
  if hash uuidgen >/dev/null 2>&1
  then
    uuidgen
  else
    cat /proc/sys/kernel/random/uuid
  fi
}

step_count=3
current_step=1
function show_step {
  echo "[$current_step/$step_count] $1"
  current_step=$(($current_step+1))
}
function await_user_confirmation {
  while ! { echo "[action required] $1" && read -t 9 ; }
  do
    :
  done
}

if [ $# -ne 2 ]
then
  echo "Usage: $(basename "$0") [ <wii-bluetooth-address> | pair ] <port>"
  exit 1
fi

wii_bdaddr="$1"
export PORT="$2"
export OUTPUT_SOCKET_PATH="/tmp/wmemulator_input_$(uuid)"

function after_starting_emulator {
  await_user_confirmation 'After the connection is established, please press Enter.'

  show_step 'Modifying relay socket permissions…'
  sudo chmod a+w "$OUTPUT_SOCKET_PATH"

  show_step 'Starting ButtonBeamer web server…'
  node .. &
}

show_step 'Starting Wiimote emulator…'
cd WiimoteEmulator
after_starting_emulator </dev/stdin &
trap 'kill $(jobs -p) >/dev/null' EXIT INT TERM
sudo ./wmemulator "$wii_bdaddr" unix "$OUTPUT_SOCKET_PATH" >/dev/stderr
