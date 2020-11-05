# LibQuality 

This project is designed to run the backend of famous open source projects

## Architecture:

<img src="diagrams/Architecture Diagram.png" alt="Architecture Diagram"/>
In this service we will expose some APIs for the frontend.

First this APIs will get to the Node controler wich is a Docker container running a node aplication.
This APIs will be accessible through the same network using basic authentication, this way we can indentify users calling these services.

This Node controler will call some github APIs in order to colect data and store them on a MySQL database, which is also alocated inside a Docker container. The MySQL database is used to store all the relevant data for the application, shuch as, historic information reggarding repositories, and what libraries each user is subscribed

## Node Controler
The Node controler will be structured in folders to keep code clean and organized.

Routes:

    Code in the Routes folder will be responsible to configure, receive data and respond the API.
    this folder will connect to the service folder to collect information not related to 
    the API comunication
Business:

    This folder will contain the business rules of the aplication, will connect to the Model and
    Requests to gather and send data.
Model:

    It's where the database interface happens, it is called by the business modules to collect and save
    data on MySQL database
Requests:

    this modules will receive some parameters from the business modules and use them to call the Github 
    API to collect data.

## Database
<img src="diagrams/ER.png" alt="Database Diagram"/>
To collet all the needed data the database is structured with theese for tables:
users is used to save users making requests on LibQuality.
userRepositories is used to save the which repositories each user will see past data.
repositories contains unmutable repository data such as owner and name.
repositoryLogs contains mutable repository data, each row is a github repository API call. At this we know if the repository call was originated via cron or not, this is relevant because we only consider calls originated by cron when return the repository statistics to the user.
issues have all the open issues thay a repository has at a given time.
labels is where the issues labels are persisted.

## API
In this project we have the following APIs exposed:

[GET] /getRepoInfo/:username/:query

    Search for a repository using the string passed on the query name and return the mostr relevant repository returned by github. This can be used when a user doesn't know the owner of a repository

[GET] /getRepoInfo/:username/:owner/:repoName

    Get information regarding the chosen repository

[PUT] /libStatistics/:username/:owner/:repoName
    
    Set up the user relationship with the repository to start receiving statistics from this repository

[DELETE] /libStatistics/:username/:owner/:repoName
    
    Destroy the user relationship with the repository to stop receiving statistics from this repository 

[GET] /libStatistics/:username
    
    Get all subscribed repositories statistics. This will only get the saved via a job that runs everyday and collect data for all the repositories that at least one user is subscribed

## Developing
You can start developing this application just by running the docker-compose command with the develop file to setup the dev database
    
    docker-compose -f DEV-docker-compose.yml up

After that you can just run the application on your machine with the comand

    npm run-script run

Also, if you don't need to persist the data for future runs you can just use the command below and ingnore the database setup

    npm run-script in-memory-run

note: The database will startup using the .env variables. You can generate this .env file considering the variables used on the .env.example

## Testing/Production
For theese environments the first thing that need to be done is generate the Dockerfile image with the command:

    docker image build . -t libquality

The docker-compose command will than use the most recent generated image and deploy the application and its database using:

    docker-compose up -d

note: In this case we will also have to setup the database environment variables in on a file named '.env' on the project root. If you don't create this '.env' the application will work but the data will not be persisted, meaning if the application stops all the data will be lost 