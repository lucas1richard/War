import player from './player';
import pieces from './pieces';

export const gameover = team => {
  if ( player.getTeam() === team ) {
    alert( 'You lose' );
    let gameStats = JSON.parse( localStorage.getItem( 'gameStats' ) );
    gameStats.gamesPlayed++;
    gameStats.gamesLost++;
    localStorage.setItem( 'gameStats', JSON.stringify( gameStats ) );
    window.location.href = window.location.origin;
  } else {
    alert( 'You win' );
    let gameStats = JSON.parse( localStorage.getItem( 'gameStats' ) );
    gameStats.gamesPlayed++;
    gameStats.gamesWon++;
    localStorage.setItem( 'gameStats', JSON.stringify( gameStats ) );
    window.location.href = window.location.origin;
  }
};

export const explodePiece = id => {
  pieces.getAll().forEach( pc => {
    if ( pc.id === id ) {
      pc.isHit( true );
    }
  } );
};
