#!/bin/bash

set -e

# Icons
start_icon="\xF0\x9F\x9B\xA0 " # Hammer and Wrench (U+1F6E0)

# Helpers Functions
collect_statics(){
    printf "\n$start_icon Collecting static files\n"
    python3 manage.py collectstatic --noinput
}
apply_migrations(){
    printf "\n$start_icon Applying database migrations\n"
    python3 manage.py migrate
}
start_server(){
    printf "\n$start_icon Starting server\n"
    python3 manage.py runserver "0.0.0.0:${WEB_PORT:-80}"
}

# ---------------------------------------------------------------------- #
# Main Function
# ---------------------------------------------------------------------- #
main(){
    collect_statics
    apply_migrations
    start_server
}

main
