import { canvas } from './canvas';
import state from './state';
import board from './board';
import pieces from './pieces';

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

export default canvas;
