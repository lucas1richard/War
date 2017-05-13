const router = require( 'express' ).Router();
const path = require( 'path' );

module.exports = function ( io ) {
  router.get( '/:gamename', ( req, res, next ) => {

    const nsp = io.of( '/' + req.params.gamename );
    nsp.on( 'connection', socket => {

      function createTeam() {
        let count = 1;
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
          { id: 9, type: 'tank', team: 'green', x: random( 900 ), y: random( 600 ) },
          { id: 10, type: 'tank', team: 'red', x: random( 900 ), y: random( 600 ) },
          { id: 11, type: 'tank', team: 'green', x: random( 900 ), y: random( 600 ) },
          { id: 12, type: 'tank', team: 'red', x: random( 900 ), y: random( 600 ) },
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


      nsp.on( 'connection', socket => {
        // Update everone that a new client is on the server
        nsp.to( socket.id ).emit( 'playerHere', Object.keys( nsp.sockets ).length > 1 );

        socket.on( 'state', state => {
          socket.broadcast.emit( 'state', Array.from( state ) );
        } );

        socket.on( 'gameover', losingteam => nsp.emit( 'gameover', losingteam ) );

        if ( Object.keys( nsp.sockets ).length >= 2 && !Object.keys( nsp.sockets ).filter( sck => nsp.sockets[ sck ].team ).length ) {
          let countdown = 3;
          let interval = setInterval( function () {
            nsp.emit( 'countdown', countdown );
            if ( !countdown ) {
              assignTeams();
              clearInterval( interval );
            }
            countdown--;
          }, 1000 );

        }

        function assignTeams() {
          let tm = createTeam();
          Object.keys( nsp.sockets ).forEach( sck => {
            let tmpTm = tm();
            if (!nsp.sockets[sck].team) {
              nsp.to( sck ).emit( 'team', tmpTm );
              nsp.sockets[ sck ].team = tmpTm;
            }
          } );
        }

        socket.on( 'mousemove', pos => {
          socket.broadcast.emit( 'mousemove', pos );
        } );

        // if ( Object.keys( nsp.sockets ).length === 2 && Object.keys( nsp.sockets ).filter( sck => nsp.sockets[ sck ].team ).length === 1 ) {
        //   let withTeam = nsp.sockets[ Object.keys( nsp.sockets ).filter( sck => nsp.sockets[ sck ].team )[ 0 ] ];
        //   if ( withTeam.team === 'green' ) {
        //     nsp.to( socket.id ).emit( 'team', 'red' );
        //     socket.team = 'red';
        //   } else {
        //     nsp.to( socket.id ).emit( 'team', 'green' );
        //     socket.team = 'green';
        //   }

        // }

        socket.on( 'requestState', () => socket.emit( 'seed', _state ) );
        socket.on( 'shoot', shot => socket.broadcast.emit( 'shoot', shot ) );
        socket.on( 'explode', id => socket.broadcast.emit( 'explode', id ) );
        socket.on( 'showRange', id => socket.broadcast.emit( 'showRange', id ) );

        // Update everone that a client left
        socket.on( 'disconnect', () => socket.broadcast.emit( 'usercount', Object.keys( nsp.sockets ).length ) );
      } );
    } );
res.sendFile( path.join( __dirname, '..', 'public', 'index.html' ) );
  } );

  return router;
};

