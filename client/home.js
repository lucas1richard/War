import { isAlpha } from 'validator';

let socket = io( window.location.orogin );
const gamelist = document.getElementById( 'gamelist' );
const gameform = document.getElementById( 'gameform' );
const gamename = document.getElementById( 'gamename' );
const games = document.getElementById( 'games' );
const errorMsg = document.getElementById( 'errorMsg' );
const stats = document.getElementById( 'stats' );

socket.on( 'nsps', nsps => {
  gamelist.innerHTML = '';
  if ( nsps.length ) {
    games.style.display = 'block';
  } else {
    games.style.display = 'none';
  }
  nsps.forEach( gm => {
    gamelist.innerHTML += `<li><a href="${gm}">${gm.slice(1)}</a></li>`;
  } );
} );

gameform.onsubmit = ev => {
  ev.preventDefault();
  let url = gamename.value.replace(/( )/g, '');
  if ( url && isAlpha( url ) ) {
    window.location.pathname = encodeURI( url );
  }
  if ( !isAlpha( url ) ) {
    errorMsg.style.display = 'block';
  } else {
    errorMsg.style.display = 'none';
  }
};

let gameStats = localStorage.getItem( 'gameStats' );

if ( gameStats ) {
  gameStats = JSON.parse( gameStats );
} else {
  let initialStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0
  };
  gameStats = initialStats;
  localStorage.setItem( 'gameStats', JSON.stringify( initialStats ) );
}
  stats.innerHTML = `Games Played: ${gameStats.gamesPlayed}<br/>
  Games Won: ${gameStats.gamesWon}
  `;
