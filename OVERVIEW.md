## Gamestate

We have a single battle playing out in real time on our server. On a fixed
interval, the battle "ticks" forward, and every living fighter has the
opportunity to make an attack on enemy fighters. The battle is continues to tick
until only fighters from a single team remain, at which point a timer is begun,
counting down to the start of the next battle.

To communicate the progressing state of the battle to the client renderer, we
have two primary subroutines: a full state handler, and a tick handler.

The former accepts a full battle state, and renders it from scratch, completely
overwriting whatever battle had been in progress previously. This is used when
a new battle begins, and when a client connects to our server mid-battle. In
both cases, the server knows to send the full state of the battle.

The latter accepts an array of "attack actions", each of which fully describes
an attack: there's an attacker, a defender, and potentially other information
about the state of the defender after the attack. Since a tick is just a series
of attacks, by applying each attack to our current battle state in order, we end
up with a correct post-tick battle state.

## Chat

Roadmap: start from client side of the sockets for the chat
'send msg' event sent from client with data -->
server listens for 'send msg' event -->
then emits 'get msg' with data to ALL clients connected -->
client receives 'get msg' event with data and you can do whatever you want with the data

Simple as that, a general roadmap of how the sockets work for the chat. Note there is no persistence, as we did not store any of the messages in a database also no https requests (awesome right!).

Now for the frontend here is a very general overview of the angular structure and layout. In index.html we have the headers and footers that can mostly be ignored for this part. The ui-vew is the main crux of the page all states and nested states will be rendered there. We have it set to have 3 nested states, which are the 3 panels. To see how they are set up look in the app.js file as it shows that each of the 3 panels are nested states of the main ui-view. Then it is just normal states but also note that the nested states are children of the parent state. The entire front end is separated into components for each state. Every state has it's own controller and html page with a helper service.js file for general functions that might be needed in several places.

Note: that we double annotated our passed in directives so the angular files could be safely minified.

## Betting

Betting occurs between both a socket connection and periodic HTTP requests. The socket handles all communication of bets, including both from client-to-server when placing a bet and client-to-server when receiving bets from other players. HTTP requests are made on battle ended events to retrieve your nugget dollar total from the server after payout.


The betting system takes place primarily in 4 files:
  * src/client/app/betboard/betboard.js - This is the controller where the logic for viewing current bets placed occurs
  * src/client/app/betboard/betting.js - This is the controller where the betting itself and the communication of a bet to the server occurs
  * src/client/app/services/services.js - The 'Bets' factory is where http requests are made, nugget dollar is stored, and valid bets are emitted to the server
  * src/server/game/betMaster.js - The server-side bet handler, this is where bets are recorded and payout is calculated. Keeps track of all bets in current battle and total amount bet on each team for purposes of payout calculation

All requests both via socket and HTTP require a jwt in the header or emitted data. The JWT is decoded to give a userid to use in database queries and username betboard display on the client side

## Store

The store component is controlled on the front end by the src/client/app/store files. The store ‘backend’ sits in src/client/services/services.js, as the ‘Store’ factory. A lot of the code there is placeholder stuff for a proper database table to handle the items purchased with nugget dollars.

The store interacts with the User table fields currentIcon and ownedIcons, poorly named as specifically to be used for chat icons, but happened to get linked in with the store stuff. The flow is fairly easy to follow in the storecontroller angular component. See comments therein for more details.

## Socket Events
* Start of Battle - Emitted from server to client when battle is starting
* Tick - Emitted from server to client every time gamestate changes
* End of Battle - Emitted from server to client when battle is over
* Countdown - Emitted from server to client every second between battles
* All bets - Emitted from server to client on connection, sends an array of all bets placed on that match
* Placed Bet - Emitted from server to client when a bet has been placed, sends an object with all bet properties
* Placing Bet - Emitted from client to server when a bet has been submitted, sends an object with all bet properties
* send msg - Emitted from client to server when a chat message is being sent, sends an object with message details
* get msg - Emitted from server to client when a chat message is being received, sends an object with message details


## Database
Single Users table containing the userId (username), password, currency (nugget dollars), currentIcon (for chat), and ownedIcons (purchased from store)