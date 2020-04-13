docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up -d db redis mysql ghost ganache;
cd ./ethereumContracts;
npx truffle deploy --network development;
cd ..;
docker build -t coreserver -f coreserver/Dockerfile  .;
docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up coreserver;
