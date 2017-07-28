import player from './player';
import pieces from './pieces';

const messageHeader = document.getElementById('messageHeader');
const messageContent = document.getElementById('messageContent');
const modal = document.getElementById('my-modal');

export const gameover = team => {
  let gameStats = JSON.parse(localStorage.getItem('gameStats'));
  gameStats.gamesPlayed++;
  modal.className = 'modal fade in';
  if (player.getTeam() === team) {
    messageHeader.innerHTML = `<h4 class="modal-title text-primary">Game Over</h4>`;
    messageContent.innerHTML = `You lost`;
    messageContent.className = 'text-danger';
    gameStats.gamesLost++;
  } else {
    messageHeader.innerHTML = `<h4 class="modal-title text-primary">Game Over</h4>`;
    messageContent.innerHTML = `You Win!`;
    messageContent.className = 'text-success';
    gameStats.gamesWon++;
  }
  localStorage.setItem('gameStats', JSON.stringify(gameStats));
  setTimeout(() => {
    window.location.href = window.location.origin;
  }, 2000);
};

export const explodePiece = id => {
  pieces.getAll().forEach(pc => {
    if (pc.id === id) {
      pc.isHit(true);
    }
  });
};

