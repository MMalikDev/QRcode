#!/bin/bash

# set -e

source ./scripts/reset.sh
# ---------------------------------------------------------------------- #
# Define Docker Variables
# ---------------------------------------------------------------------- #
declare -a images=(
    server_fastapi
    server_django
)
declare -a volumes=(
    #
)
declare -a bindings=(
    #
)

# ---------------------------------------------------------------------- #
# Main Function
# ---------------------------------------------------------------------- #
main(){
    # Shut down all containers
    docker compose down
    end_proxy
    
    # Clean up
    run folders remove_folders  ${bindings[*]}
    run volumes remove_volumes  ${volumes[*]}
    run images  remove_images   ${images[*]}
    prune_docker
}

main $@
