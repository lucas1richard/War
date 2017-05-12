import state from './state';

import { sandImg } from './utils';
import Piece from './Piece';
import board from './board';
import player from './player';

import { canvas, context } from './canvas';

const shootBtn = document.getElementById( 'shoot' );
const moveBtn = document.getElementById( 'move' );

shootBtn.addEventListener( 'click', function () {
  canvas.className = 'shooting';
  this.className = 'btn btn-default active';
  moveBtn.className = 'btn btn-default';
  state.action = 'shooting';
} );

moveBtn.addEventListener( 'click', function () {
  canvas.className = 'moving';
  this.className = 'btn btn-default active';
  shootBtn.className = 'btn btn-default';
  state.action = 'moving';
} );

canvas.addEventListener( 'mouseup', function () {
  state.shooting = false;
} );

canvas.addEventListener( 'mousemove', function ( ev ) {
  const mousePos = {
    x: ev.pageX - this.offsetLeft,
    y: ev.pageY - this.offsetTop
  };

  if ( state.shooting ) {
    state.lastMousePosition = Object.assign( {}, state.currentMousePosition );
    state.currentMousePosition = mousePos;

    board.shoot( state.lastMousePosition, state.currentMousePosition, state.pieces );
  } else {
    // pieces.forEach( pc => {
    //   if ( distance( pc, mousePos ) < 30 ) {
    //     placeScope( pc );
    //   }
    // } );
  }
} );

canvas.addEventListener( 'mousedown', function ( ev ) {
  state.shot = [];
  const mousePos = {
    x: ev.pageX - this.offsetLeft,
    y: ev.pageY - this.offsetTop
  };
  if ( state.action === 'shooting' ) {
    state.shotCanHit = true;
    state.pieces.forEach( pc => {
      if ( pc.mouseOn( mousePos ) ) {
        state.shooting = true;
      }
    } );
  }

  if ( state.action === 'moving' ) {
    state.moving = true;
    if ( !state.pieceToMove ) {
      state.pieces.forEach( pc => {
        if ( pc.mouseOn( mousePos ) ) {
          state.pieceToMove = pc;
          state.pieceToMove.showRange();
        }
      } );
    } else {
      if (state.pieceToMove) {
        state.pieces.filter(pc => pc.id === state.pieceToMove.id)[0].moveTo( mousePos, ( err ) => {
          if ( !err ) {
            state.pieceToMove = null;
          } else {
            console.error( err );
          }
        } );
      }
    }
  }


  state.currentMousePosition = Object.assign( {}, mousePos );

  state.drawStart = Object.assign( {}, state.currentMousePosition );
  state.lastDistance = 0;
  state.shotStart = new Date();
} );


let socket = io( window.location.origin );

board.on( 'render', () => {
  console.log( 'render emitted' );
  socket.emit( 'state', state );
} );
board.on( 'clear', () => socket.emit( 'clear' ) );
board.on( 'shoot', ( shot ) => socket.emit( 'shoot', shot ) );
board.on( 'showRange', id => socket.emit( 'showRange', id ) );

board.on( 'explode', id => socket.emit( 'explode', id ) );

socket.on( 'draw', _board => board.draw( ...Object.values( _board ) ) );
socket.on( 'shoot', shot => board.drawShot( shot ) );
socket.on( 'explode', id => {
  state.pieces.forEach( pc => {
    if ( pc.id === id ) {
      pc.isHit( true );
    }
  } );
} );

socket.on( 'showRange', id => {
  state.pieces.forEach( pc => {
    if ( pc.id === id ) pc.showRange();
  } );
} );

socket.on( 'seed', _state => {
  delete _state.playerTeam;
  Object.assign( state, _state );
  state.pieces = state.pieces.map( js => new Piece( js.id, js.type, js.team, { x: js.x, y: js.y }, js.health ) );
  if ( state.pieceToMove ) state.pieceToMove = state.pieces.filter( pc => pc.id === state.pieceToMove.id )[ 0 ];
  board.render( true );
} );

socket.on( 'playerHere', playerHere => {
  console.log( playerHere );
  if ( playerHere ) {
    socket.emit( 'requestState' );
    state.playerTeam = 'red';
  } else {
    context.drawImage( sandImg, 0, 0, 900, 600 );

    state.pieces = [
      new Piece( 1, 'tank', 'green', {
        x: Math.floor( ( 900 - state.pieceSize ) * Math.random() ),
        y: Math.floor( ( 600 - state.pieceSize ) * Math.random() )
      } ),
      new Piece( 2, 'drone', 'green', {
        x: Math.floor( ( 900 - state.pieceSize ) * Math.random() ),
        y: Math.floor( ( 600 - state.pieceSize ) * Math.random() )
      } ),
      new Piece( 3, 'tank', 'red', {
        x: Math.floor( ( 900 - state.pieceSize ) * Math.random() ),
        y: Math.floor( ( 600 - state.pieceSize ) * Math.random() )
      } ),
      new Piece( 4, 'drone', 'red', {
        x: Math.floor( ( 900 - state.pieceSize ) * Math.random() ),
        y: Math.floor( ( 600 - state.pieceSize ) * Math.random() )
      } ),
    ];

    board.render();
  }
} );

socket.on( 'state', _state => {
  // delete _state.playerTeam;
  let { pieces } = _state;
  Object.assign( state, _state );
  state.pieces = state.pieces.map( js => new Piece( js.id, js.type, js.team, { x: js.x, y: js.y }, js.health ) );
  // if ( state.pieceToMove ) state.pieceToMove = state.pieces.filter( pc => pc.id === state.pieceToMove.id )[ 0 ];
  state.action = 'shooting';
  board.render( true );
} );

socket.on( 'clear', board.clear );

socket.on( 'team', team => {
  console.log( 'team', team );
  if ( team ) {
    state.playerTeam = team;
    player.setTeam( team );
  }
} );

// let numTracker = (function() {
//   var div = document.getElementById('userCount');
//   return num => {
//       div.innerText = num !== 1 ? `${num} users` : `1 user`;
//       div.style.fontWeight = 'bold';
//       div.style.color = 'red';
//       setTimeout(function() {
//         div.style.fontWeight = 'initial';
//         div.style.color = 'initial';
//       }, 750);
//     };
// })();

// socket.on('usercount', numTracker);

