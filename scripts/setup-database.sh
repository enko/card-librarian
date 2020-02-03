#!/usr/bin/env bash

mkdir ~/card-librarian/database
cd ~/card-librarian/database
initdb -U postgres .
cp ~/card-librarian/files/postgresql.conf .
pg_ctl -D . -l logfile start
createdb -h 127.0.0.1 -U postgres mtg_app
