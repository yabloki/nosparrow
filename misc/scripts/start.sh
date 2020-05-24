#!/bin/bash
if [ "$1" = "-b" ]; then
    cd Ghost;
    grunt release;
    docker build -t ghost:custom .;
    cd ../;
fi
docker-compose -f docker-compose.yml -f docker-compose.dev.yml  down;
docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up -d db redis mysql ghost ganache;
sleep 2;
cd ./ethereumContracts;
npx truffle deploy --network development;
cd ..;
if [ "$1" = "-b" ]; then
    docker build -t coreserver -f coreserver/Dockerfile  .;
fi
docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up ofelia coreserver eventProcessor;