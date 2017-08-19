import state from './state';

import { sandImg } from './utils';
import board from './board';
import player from './player';
import pieces from './pieces';

import { context } from './canvas';
import { gameover, explodePiece } from './boardEvents';
import canvas from './canvasEvents';
import {
  CLEAR,
  COUNT_DOWN,
  DISCONNECTED,
  EXPLODE,
  GAME_IS_FULL,
  GAME_OVER,
  MOUSE_MOVE,
  PLAYER_HERE,
  RENDER,
  REQUEST_STATE,
  SEED,
  SHOW_RANGE,
  SHOOT,
  STATE as _STATE,
  TEAM,
} from '../constants';

window.addEventListener('keydown', btnPress, false);
const gamestatus = document.getElementById('gamestatus');
const messageHeader = document.getElementById('messageHeader');
const messageContent = document.getElementById('messageContent');
const modal = document.getElementById('my-modal');

const othermouse = document.getElementById('othermouse');

function btnPress(ev) {
  if (ev.keyCode === 32) {
    if (canvas.className === 'shooting noselect') {
      canvas.className = 'moving noselect';
      state.action = 'moving';
    } else {
      canvas.className = 'shooting noselect';
      state.action = 'shooting';
    }
  }
}


let gameStats = localStorage.getItem('gameStats');

if (gameStats) {
  console.log(JSON.parse(gameStats));
} else {
  let initialStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0
  };
  localStorage.setItem('gameStats', JSON.stringify(initialStats));
  console.log(initialStats);
}

let socket = io(window.location.href);

board.on(EXPLODE, id => socket.emit(EXPLODE, id));
board.on(GAME_OVER, team => socket.emit(GAME_OVER, team));
board.on(RENDER, () => socket.emit(_STATE, pieces.getAll()));
board.on(SHOOT, (shot) => socket.emit(SHOOT, shot));
board.on(SHOW_RANGE, id => socket.emit(SHOW_RANGE, id));
board.on('mousemove', pos => socket.emit(MOUSE_MOVE, pos));

socket.on(GAME_OVER, gameover);
socket.on(SHOOT, shot => board.drawShot(shot));
socket.on(EXPLODE, explodePiece);
socket.on(COUNT_DOWN, countdown => {
  gamestatus.innerHTML = `Game starting in<br/>${countdown}`;
});

socket.on(MOUSE_MOVE, pos => {
  othermouse.style.top = `${pos.y - 15}px`;
  othermouse.style.left = `${pos.x - 15}px`;
});
socket.on(SHOW_RANGE, id => {
  pieces.getAll().forEach(pc => {
    if (pc.id === id) pc.showRange();
  });
});
socket.on(DISCONNECTED, () => {
  messageHeader.innerHTML = `<h4 class="modal-title text-primary">Update</h4>`;
  messageContent.innerHTML = `It looks like the other player got disconnected`;
  messageContent.className = 'text-danger';
  modal.className = 'modal fade in';
  setTimeout(() => {
    window.location.href = window.location.origin;
  }, 2000);
});

socket.on(SEED, _state => {
  delete _state.playerTeam;
  Object.assign(state, _state);
  pieces.setPieces(state.pieces);
  board.render();
});

socket.on(PLAYER_HERE, playerHere => {
  if (playerHere) {
    socket.emit(REQUEST_STATE);
    state.playerTeam = 'red';
  } else {
    context.drawImage(sandImg, 0, 0, 900, 600);
    const random = len => Math.floor((len - state.pieceSize) * Math.random());
    pieces.setPieces([
      { id: 1, type: 'tank', team: 'green', x: random(900), y: random(600) },
      { id: 2, type: 'drone', team: 'green', x: random(900), y: random(600) },
      { id: 3, type: 'tank', team: 'red', x: random(900), y: random(600) },
      { id: 4, type: 'drone', team: 'red', x: random(900), y: random(600) },
      { id: 5, type: 'tank', team: 'green', x: random(900), y: random(600) },
      { id: 6, type: 'drone', team: 'green', x: random(900), y: random(600) },
      { id: 7, type: 'tank', team: 'red', x: random(900), y: random(600) },
      { id: 8, type: 'drone', team: 'red', x: random(900), y: random(600) },
    ]);

    board.render(true);
  }
});

socket.on(_STATE, _state => {
  pieces.moveAllTo(_state);
  state.action = 'shooting';
  board.render(true);
});

socket.on(GAME_IS_FULL, () => {
  alert('This game is already full');
  window.location.href = window.location.origin;
});

socket.on(CLEAR, board.clear);

socket.on(TEAM, team => {

  if (team) {
    state.playerTeam = team;
    player.setTeam(team);
  }

  canvas.style.display = 'block';
  if (document.querySelector('#jumbo')) {
    document.body.removeChild(document.getElementById('jumbo'));
  }
});

