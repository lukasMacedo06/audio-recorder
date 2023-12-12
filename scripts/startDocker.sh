#!/bin/bash

kill -9 $(lsof -t -i:3000)

for id in $(docker ps -q)
  do
    if [[ $(docker port "${id}") == *"${1}"* ]]; then
        echo "Stopping container ${id} that was running on port ${1}."
        docker stop "${id}"
    fi
  done

react-scripts start &
cd zendesk-mock
docker run --rm -d -p 4567:4567 -v ${PWD}:/data -it zat_server_image:1.0.0 zat server -c "${2}"