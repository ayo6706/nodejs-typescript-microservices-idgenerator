# Id Generator for Microservices 

This program allows you to generate random id's for multiple instance server without causing a duplicate inspired by twitter snowflake

## to run 
yarn install or npm install
1652400000
## to run development mode
yarn dev or npm run dev

## to check health of server 
localhost:port/healthcheck

## get all instance Id
localhost:port/api/instance

## to generate Id endpoint 
localhost:port/api/instance/generate

## to change status of instance
localhost:port/api/instance/status/:instanceId
required field = Body.status
status = {
    1: "running",
    0: "stopped"
}


# to run with docker

docker-compose up build

## to  run multiple instance 
docker-compose up --scale idgenerator={number}



### Note make you config .env file to run

 mongodb+srv://vadton:mongodb2022@cluster0.tbbm0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority