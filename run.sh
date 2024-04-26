#!/bin/bash

# set -e

source ./scripts/run.sh
# ---------------------------------------------------------------------- #
# Define Docker Variables
# ---------------------------------------------------------------------- #
declare -a reloads=(
    # fastapi
    # django
)

declare -a logs=(
    # fastapi
    # django
)

# ---------------------------------------------------------------------- #
# OPTIONS
# ---------------------------------------------------------------------- #
run_devcontainer(){
    run_python_dev
    exit 0
}
run_locally(){
    run_python
    exit 0
}
run_docker(){
    reload_services ${reloads[*]}
    handle_errors $?
    
    docker image prune -f
    follow_logs ${logs[*]}
    exit 0
}

use_env_file(){
    [[ $(get_bool DEVCONTAINER) == "true" ]] && run_devcontainer
    [[ $(get_bool RUN_LOCAL) == "true" ]] && run_locally
    run_docker
}

# ---------------------------------------------------------------------- #
# Main Function
# ---------------------------------------------------------------------- #
main(){
    while getopts "sdlch" OPTION; do
        case $OPTION in
            s) start_proxy      ;;
            d) run_devcontainer ;;
            l) run_locally      ;;
            c) run_docker       ;;
            h) display_usage    ;;
            ?) display_usage    ;;
        esac
    done
    shift $((OPTIND -1))
    
    use_env_file
}

main $@
