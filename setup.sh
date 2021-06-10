#!/bin/bash

set -e

step_count=2
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

if [ $# -ne 0 ]
then
  echo "Usage: $(basename "$0")"
  exit 1
fi

show_step 'Stopping bluetooth.service…'
sudo systemctl stop bluetooth

show_step 'Starting bluez-4.101 bluetoothd…'
sudo WiimoteEmulator/bluez-4.101/dist/sbin/bluetoothd
