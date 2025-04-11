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
# HELPER
# ---------------------------------------------------------------------- #
run_fastapi(){
    printf "\n$icon_start Running FastAPI Application\n\n"
    cd api
    python main.py
    cd ..
}
run_django(){
    printf "\n$icon_start Running Django Application\n\n"
    load_env
    cd server
    python manage.py runserver
    cd ..
}
select_framework(){
    local framework=$(echo "$1" | tr '[A-Z]' '[a-z]')
    case $framework in
        api*|fastapi*)
            run_fastapi
        ;;
        server*|django*)
            run_django
        ;;
        *)
            echo "!!WARNING!! No valid local option given"
            echo "  Please choose one of the following framework:"
            printf "\t- Fastapi\n\t- Django\n"
    esac
}

# ---------------------------------------------------------------------- #
# OPTIONS
# ---------------------------------------------------------------------- #
run_devcontainer(){
    select_framework "$1"
    exit 0
}
run_locally(){
    use_venv
    select_framework "$1"
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
    [[ $(get_bool DEVCONTAINER) == "true" ]] && run_devcontainer 'Django'
    [[ $(get_bool RUN_LOCAL) == "true" ]] && run_locally 'FastAPI'
    run_docker
}

# ---------------------------------------------------------------------- #
# Main Function
# ---------------------------------------------------------------------- #
main(){
    while getopts "d:l:sch" OPTION; do
        case $OPTION in
            d) run_devcontainer $OPTARG ;;
            l) run_locally $OPTARG      ;;
            s) start_proxy              ;;
            c) run_docker               ;;
            h) display_usage            ;;
            ?) display_usage            ;;
        esac
    done
    shift $((OPTIND -1))
    
    use_env_file
}

main $@
