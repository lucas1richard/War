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
  return function () {
    if ( count === 1 ) {
      count++;
      return 'green';
    }
    if ( count === 2 ) {
      count++;
      return 'red';
    }
    count++;
  };
}

const random = len => Math.floor( ( len - 30 ) * Math.random() );

let _state = {
  playerTeam: 'green',
  shotCanHit: true,
  pieceSize: 30,
  pieces: [
    { id: 1, type: 'tank', team: 'green', x: random( 900 ), y: random( 600 ) },
    { id: 2, type: 'drone', team: 'green', x: random( 900 ), y: random( 600 ) },
    { id: 3, type: 'tank', team: 'red', x: random( 900 ), y: random( 600 ) },
    { id: 4, type: 'drone', team: 'red', x: random( 900 ), y: random( 600 ) },
    { id: 5, type: 'tank', team: 'green', x: random( 900 ), y: random( 600 ) },
    { id: 6, type: 'drone', team: 'green', x: random( 900 ), y: random( 600 ) },
    { id: 7, type: 'tank', team: 'red', x: random( 900 ), y: random( 600 ) },
    { id: 8, type: 'drone', team: 'red', x: random( 900 ), y: random( 600 ) },
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
console.log( team() );

( io => {

  io.on( 'connection', socket => {
    // Update everone that a new client is on the server
    io.emit( 'usercount', Object.keys( io.sockets.sockets ).length );

    let mTeam = team();
    socket.team = mTeam;

    io.to( socket.id ).emit( 'playerHere', Object.keys( io.sockets.sockets ).length > 1 );
    io.to( socket.id ).emit( 'team', mTeam );

    socket.on( 'state', state => {
      socket.broadcast.emit( 'state', Array.from( state ) );
    } );

    socket.on( 'gameover', losingteam => io.emit( 'gameover', losingteam ) );

    if ( Object.keys( io.sockets.sockets ).length >= 2 && !Object.keys( io.sockets.sockets ).filter( sck => io.sockets.sockets[ sck ].team ).length ) {
      console.log( 'aiyaaa' );
      let tm = createTeam();
      tm();
      Object.keys( io.sockets.sockets ).forEach( sck => {
        let tmpTm = tm();
        io.to( sck ).emit( 'team', tmpTm );
        io.sockets.sockets[ sck ].team = tmpTm;
      } );
    }

    socket.on( 'mousemove', pos => {
      // console.log(pos);
      socket.broadcast.emit( 'mousemove', pos );
    } );

    if ( Object.keys( io.sockets.sockets ).length === 2 && Object.keys( io.sockets.sockets ).filter( sck => io.sockets.sockets[ sck ].team ).length === 1 ) {
      let withTeam = io.sockets.sockets[ Object.keys( io.sockets.sockets ).filter( sck => io.sockets.sockets[ sck ].team )[ 0 ] ];
      if ( withTeam.team === 'green' ) {
        io.to( socket.id ).emit( 'team', 'red' );
        socket.team = 'red';
      } else {
        io.to( socket.id ).emit( 'team', 'green' );
        socket.team = 'green';
      }

    }

    socket.on( 'requestState', () => socket.emit( 'seed', _state ) );
    socket.on( 'shoot', shot => socket.broadcast.emit( 'shoot', shot ) );
    socket.on( 'explode', id => socket.broadcast.emit( 'explode', id ) );
    socket.on( 'showRange', id => socket.broadcast.emit( 'showRange', id ) );

    // Clear the memory and inform all clients to clear the board
    socket.on( 'clear', () => {
      socket.broadcast.emit( 'clear' );
    } );

    // Update everone that a client left
    socket.on( 'disconnect', () => socket.broadcast.emit( 'usercount', Object.keys( io.sockets.sockets ).length ) );

  } );
} )( socketio( server ) );

