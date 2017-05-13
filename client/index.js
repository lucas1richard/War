import state from './state';

import { sandImg } from './utils';
import board from './board';
import player from './player';
import pieces from './pieces';

import { context } from './canvas';
import { gameover, explodePiece } from './boardEvents';
import canvas from './canvasEvents';

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


let gameStats = localStorage.getItem( 'gameStats' );

if ( gameStats ) {
  console.log( JSON.parse( gameStats ) );
} else {
  let initialStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0
  };
  localStorage.setItem( 'gameStats', JSON.stringify( initialStats ) );
  console.log( initialStats );
}

let socket = io( window.location.href );

board.on( 'explode', id => socket.emit( 'explode', id ) );
board.on( 'gameover', team => socket.emit( 'gameover', team ) );
board.on( 'render', () => socket.emit( 'state', pieces.getAll() ) );
board.on( 'shoot', ( shot ) => socket.emit( 'shoot', shot ) );
board.on( 'showRange', id => socket.emit( 'showRange', id ) );
board.on( 'mousemove', pos => socket.emit( 'mousemove', pos ) );



socket.on( 'gameover', gameover );

socket.on( 'shoot', shot => board.drawShot( shot ) );
socket.on( 'explode', explodePiece);

const gamestatus = document.getElementById( 'gamestatus' );

socket.on( 'countdown', countdown => {
  gamestatus.innerText = `Game starting in ${countdown}`;
} );

socket.on( 'mousemove', pos => {
  othermouse.style.top = `${pos.y - 15}px`;
  othermouse.style.left = `${pos.x - 15}px`;
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

  if ( team ) {
    state.playerTeam = team;
    player.setTeam( team );
  }

  canvas.style.display = 'block';
  if ( document.querySelector( '#jumbo' ) ) {
    document.body.removeChild( document.getElementById( 'jumbo' ) );
  }
} );

socket.on( 'usercount', () => console.log( 'usercount' ) );

