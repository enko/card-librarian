#!/usr/bin/env bash

# Enable bash strict mode
set -euo pipefail
IFS=$'\n\t'

sudo mount -t tmpfs -o size=4G /dev/null /dev/shm
sleep 2
sudo nohup dockerd --bip 10.18.0.1/16 </dev/null >/dev/null 2>&1 &
sudo usermod -aG docker "$(whoami)"
