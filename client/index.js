import state from './state';

import { sandImg } from './utils';
import board from './board';
import player from './player';
import pieces from './pieces';

import { canvas, context } from './canvas';

window.addEventListener( 'keydown', btnPress, false );

const othermouse = document.getElementById( 'othermouse' );

function btnPress( ev ) {
  if ( ev.keyCode === 32 ) {
    if ( canvas.className === 'shooting' ) {
      canvas.className = 'moving';
      state.action = 'moving';
    } else {
      canvas.className = 'shooting';
      state.action = 'shooting';
    }
  }
}


function resize() {
    // Unscale the canvas (if it was previously scaled)
    context.setTransform(1, 0, 0, 1, 0, 0);

    // The device pixel ratio is the multiplier between CSS pixels
    // and device pixels
    const pixelRatio = window.devicePixelRatio || 1;

    // Allocate backing store large enough to give us a 1:1 device pixel
    // to canvas pixel ratio.
    let w = canvas.clientWidth * pixelRatio,
        h = canvas.clientHeight * pixelRatio;
    if (w !== canvas.width || h !== canvas.height) {
        // Resizing the canvas destroys the current content.
        // So, save it...
        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);

        canvas.width = w; canvas.height = h;

        // ...then restore it.
        context.putImageData(imgData, 0, 0);
    }

    // Scale the canvas' internal coordinate system by the device pixel
    // ratio to ensure that 1 canvas unit = 1 css pixel, even though our
    // backing store is larger.
    context.scale(pixelRatio, pixelRatio);

    // context.lineWidth = 5;
    context.lineJoin = 'round';
    context.lineCap = 'round';
}

resize();

canvas.addEventListener( 'mouseup', function () {
  state.shooting = false;
} );

canvas.addEventListener( 'mousemove', function ( ev ) {
  const mousePos = {
    x: ev.pageX - this.offsetLeft,
    y: ev.pageY - this.offsetTop
  };

  board.emit( 'mousemove', mousePos );

  if ( state.shooting ) {
    state.lastMousePosition = Object.assign( {}, state.currentMousePosition );
    state.currentMousePosition = mousePos;

    board.shoot( state.lastMousePosition, state.currentMousePosition, pieces.getAll() );
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
    pieces.getAll().forEach( pc => {
      if ( pc.mouseOn( mousePos ) ) {
        state.shooting = true;
      }
    } );
  }

  if ( state.action === 'moving' ) {
    state.moving = true;
    if ( !state.pieceToMove ) {
      pieces.getAll().forEach( pc => {
        if ( pc.mouseOn( mousePos ) ) {
          state.pieceToMove = pc;
          state.pieceToMove.showRange();
        }
      } );
    } else {
      if ( state.pieceToMove ) {
        pieces.findById( state.pieceToMove.id ).moveTo( mousePos, ( err ) => {
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
  socket.emit( 'state', pieces.getAll() );
} );
board.on( 'clear', () => socket.emit( 'clear' ) );
board.on( 'shoot', ( shot ) => socket.emit( 'shoot', shot ) );
board.on( 'showRange', id => socket.emit( 'showRange', id ) );
board.on( 'mousemove', pos => socket.emit( 'mousemove', pos ) );

board.on( 'explode', id => socket.emit( 'explode', id ) );
board.on( 'gameover', team => socket.emit( 'gameover', team ) );

socket.on( 'gameover', team => {
  if ( player.getTeam() === team ) {
    alert( 'You lose' );
  } else {
    alert( 'You win' );
  }
} );

socket.on( 'draw', _board => board.draw( ...Object.values( _board ) ) );
socket.on( 'shoot', shot => board.drawShot( shot ) );
socket.on( 'explode', id => {
  pieces.getAll().forEach( pc => {
    if ( pc.id === id ) {
      console.log( pc );
      pc.isHit( true );
    }
  } );
} );

socket.on( 'mousemove', pos => {
  othermouse.style.top = `${pos.y - 7}px`;
  othermouse.style.left = `${pos.x - 7}px`;
} );

socket.on( 'showRange', id => {
  pieces.getAll().forEach( pc => {
    if ( pc.id === id ) pc.showRange();
  } );
} );

socket.on( 'seed', _state => {
  delete _state.playerTeam;
  Object.assign( state, _state );
  pieces.setPieces( state.pieces );
  board.render();
} );

socket.on( 'playerHere', playerHere => {
  console.log( playerHere );
  if ( playerHere ) {
    socket.emit( 'requestState' );
    state.playerTeam = 'red';
  } else {
    context.drawImage( sandImg, 0, 0, 900, 600 );
    const random = len => Math.floor( ( len - state.pieceSize ) * Math.random() );
    pieces.setPieces( [
      { id: 1, type: 'tank', team: 'green', x: random( 900 ), y: random( 600 ) },
      { id: 2, type: 'drone', team: 'green', x: random( 900 ), y: random( 600 ) },
      { id: 3, type: 'tank', team: 'red', x: random( 900 ), y: random( 600 ) },
      { id: 4, type: 'drone', team: 'red', x: random( 900 ), y: random( 600 ) },
      { id: 5, type: 'tank', team: 'green', x: random( 900 ), y: random( 600 ) },
      { id: 6, type: 'drone', team: 'green', x: random( 900 ), y: random( 600 ) },
      { id: 7, type: 'tank', team: 'red', x: random( 900 ), y: random( 600 ) },
      { id: 8, type: 'drone', team: 'red', x: random( 900 ), y: random( 600 ) },
    ] );

    board.render( true );
  }
} );

socket.on( 'state', _state => {
  // Object.assign( state, _state );
  // state.pieces = state.pieces.map( js => new Piece( js.id, js.type, js.team, { x: js.x, y: js.y }, js.health ) );
  pieces.moveAllTo( _state );
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

