#!/bin/bash

set -e

step_count=1
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

[ "$1" = 'install-dependencies' ] && install_dependencies=y
if [ $# -ne 0 ] && { [ $# -ne 1 ] || [ -z "$install_dependencies" ] ; }
then
  echo "Usage: $(basename "$0") [ install-dependencies ]"
  exit 1
fi

if [ "$install_dependencies" = y ]
then
  step_count=$(($step_count+1))
  show_step 'Installing dependencies…'
  if hash apt
  then
    sudo apt install libdbus-1-dev libglib2.0-dev libsdl1.2-dev
  else
    echo "apt not found, aborting. Please install the following dependencies or equivalent manually: libdbus-1-dev libglib2.0-dev libsdl1.2-dev"
    exit 1
  fi
fi

show_step 'Building WiimoteEmulator…'
cd WiimoteEmulator
chmod +x build-custom.sh
./build-custom.sh
