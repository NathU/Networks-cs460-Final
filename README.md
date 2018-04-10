# Networks-cs460-Final
Simple (realtime-ish) multiplayer game over HTTP
Places handling of game logic on the client side. relies on current-ness of game model retrieved from the server several times per second.
Uses NodeJS, Express, & MySQL on the backend. HTML & javascript on the front.
Note: there are a few changes I would _like_ to make, namely 
- change AJAX <--> Express(HTTP) client-server interactions to use the NodeJS websocket library instead.
- automatically remove players from the database once they close their browser/refresh their page.

## Initial Requirements
- node version 6.9.4 or greater
- mysql server version 5.6.17 or greater
- a REST client like Postman to call endpoints directly with the appropriate JSON parameters in the request body. Or you could figure it out with `curl`

## Setup Instructions
- in the same directory as `game_server.js`, from the command line run `npm install`. This will install all the node module dependencies listed in `package.json`
- fill in the appropriate values after `TO` and `BY` on line 3 of `./sql/db_init.sql` (your mysql username & password)
- set up the database by logging into your mysql server and running first `source ...literal_path.../sql/db_init.sql;`, then `source ...literal_path.../sql/databaseSP.sql;`
- fill in the appropriate values for "user" & "password" in `environment.js` so the application can access your mysql server. You may choose to change `port` if you like - this is the port our game server listens on.
- make sure `vars.url` in `./client/game_logic.js` (~line 4) is `http://localhost:<port>/`, where port = the value of `port` in `./environment.js` mentioned above.

## Runtime Instructions (for grader)
- start the game server: `node game_server.js`
- open a browser at `localhost:3001` or whatever port you chose in setup
- enter a player name in the text input and press "JOIN". You should be able to move around.
- in another browser, do the same, choosing a different name.
- from your REST client or with `curl` send to the game server a POST request containing the name of one of your players to the `giveFlag` endpoint, i.e. `http://localhost:3001/giveFlag` with the JSON object `{"name":"<your player's name here>"}` in the request body.
- you should now see that player's color is yellow and their score is counting up rapidly. use your other player to collide with the yellow player to steal the flag (it may take a few attempts...)
- note, players remain in the game server database until the `clearGameState` endpoint is called. Only active players (those being controlled from a browser) are able to move and participate in the game.
