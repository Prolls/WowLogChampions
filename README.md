# To make it run on a node js server:<br />
Add a .env file in the root folder with the following content:
CLIENT_ID=!Warcraft Log Client ID! <br />
CLIENT_SECRET=!Warcraft Log Secret!<br />
TOKEN_DISCORD=!Discord Token!<br />

# To make it run using docker.
docker-compose :

version: "3.7"<br />
services:<br />
  logchampions:<br />
    image: prolls/logchampions<br />
    container_name: logchampions<br />
    environment:<br />
      - CLIENT_ID=*Warcraft log client id*<br />
      - CLIENT_SECRET=*Warcraft log secret id*<br />
      - TOKEN_DISCORD=*discord bot token*<br />
    restart: always<br />

