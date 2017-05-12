const express = require( 'express' );
const app = express();
const path = require( 'path' );
const socketio = require( 'socket.io' );


app.use( '/vendor', express.static( path.join( __dirname, '..', 'node_modules' ) ) );
app.use( '/img', express.static( path.join( __dirname, '..', 'public', 'img' ) ) );
app.use( '/js', express.static( path.join( __dirname, '..', 'public', 'js' ) ) );

app.use( '/', ( req, res, next ) => {
  res.sendFile( path.join( __dirname, '..', 'public', 'index.html' ) );
} );

const server = app.listen( 3000, () => console.log( `Listening on port 3000` ) );

function createTeam() {
  let count = 0;
  return function() {
    if (count === 1) {
      count++;
      return 'green';
    }
    if (count === 2) {
      count++;
      return 'red';
    }
    count++;
  };
}

let _state = {
  playerTeam: 'green',
  shotCanHit: true,
  pieceSize: 30,
  pieces: [
    { id: 1, type: 'tank', team: 'green', x: 204, y: 129, health: 3, range: 100, img: '/img/tank-green', icon: {} },
    { id: 2, type: 'drone', team: 'green', x: 678, y: 40, health: 2, range: 200, img: '/img/drone-green', icon: {} },
    { id: 3, type: 'tank', team: 'red', x: 409, y: 112, health: 3, range: 100, img: '/img/tank-red', icon: {} },
    { id: 4, type: 'drone', team: 'red', x: 832, y: 541, health: 2, range: 200, img: '/img/drone-red', icon: {} }
  ],
  pieceToMove: null,
  action: 'shooting',
  shooting: false,
  currentMousePosition: { x: 0, y: 0 },
  lastMousePosition: { x: 0, y: 0 },
  drawStart: { x: 0, y: 0 },
  lastDistance: 0,
  shotStart: {},
  shotEnd: {}
};

const team = createTeam();
console.log(team());

( io => {
  let toDraw = [];

  io.on( 'connection', socket => {
    console.log(socket.id);
    // Update everone that a new client is on the server
    io.emit( 'usercount', Object.keys( io.sockets.sockets ).length );

    let mTeam = team();
    console.log(mTeam);

    io.to( socket.id ).emit( 'playerHere', Object.keys( io.sockets.sockets ).length > 1 );
    io.to( socket.id ).emit( 'team', mTeam );

    socket.on( 'state', state => {
      Object.assign( _state, state );
      socket.broadcast.emit( 'state', _state );
    } );


    socket.on( 'requestState', () => socket.emit( 'seed', _state ) );
    socket.on( 'shoot', shot => socket.broadcast.emit( 'shoot', shot ) );
    socket.on( 'explode', id => socket.broadcast.emit( 'explode', id ) );
    socket.on( 'showRange', id => socket.broadcast.emit( 'showRange', id ) );

    // Clear the memory and inform all clients to clear the board
    socket.on( 'clear', () => {
      toDraw = [];
      socket.broadcast.emit( 'clear' );
    } );

    // Update everone that a client left
    socket.on( 'disconnect', () => socket.broadcast.emit( 'usercount', Object.keys( io.sockets.sockets ).length ) );

  } );
} )( socketio( server ) );

