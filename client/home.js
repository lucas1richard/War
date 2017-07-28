import { isAlpha } from 'validator';

let socket = io(window.location.origin);
const gamelist = document.getElementById('gamelist');
const gameform = document.getElementById('gameform');
const gamename = document.getElementById('gamename');
const games = document.getElementById('games');
const errorMsg = document.getElementById('errorMsg');
const stats = document.getElementById('stats');

socket.on('nsps', nsps => {
  gamelist.innerHTML = '';
  if (nsps.length) {
    games.style.display = 'block';
  } else {
    games.style.display = 'none';
  }
  nsps.filter(gm => gm.length > 1).forEach(gm => {
    gamelist.innerHTML += `<li style="display: inline-block;">
      <a href="${gm}" style="
        width:100px;
        background-color: #fff;
        height: 100px;
        display: inline-block;
        text-align: center;
        padding-top: 40px;
        border: 1px solid black;
        border-radius: 6px;
        font-weight: bold;
        font-size: 20px
      ">
        ${gm.slice(1)}
      </a>
    </li>`;
  });
});

gameform.onsubmit = ev => {
  ev.preventDefault();
  let url = gamename.value.replace(/( )/g, '');
  if (url && isAlpha(url)) {
    window.location.pathname = encodeURI(url);
  }
  if (!isAlpha(url)) {
    errorMsg.style.display = 'block';
  } else {
    errorMsg.style.display = 'none';
  }
};

let gameStats = localStorage.getItem('gameStats');

if (gameStats) {
  gameStats = JSON.parse(gameStats);
} else {
  let initialStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0
  };
  gameStats = initialStats;
  localStorage.setItem('gameStats', JSON.stringify(initialStats));
}
stats.innerHTML = `Games Played: ${gameStats.gamesPlayed}<br/>
  Games Won: ${gameStats.gamesWon}
  `;

