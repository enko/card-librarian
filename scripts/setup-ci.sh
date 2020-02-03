#!/usr/bin/env bash

# Enable bash strict mode
set -euo pipefail
IFS=$'\n\t'

export NVM_DIR="$HOME/.nvm"

set +x

. /usr/share/nvm/init-nvm.sh
cd card-librarian
nvm install
nvm use --silent
