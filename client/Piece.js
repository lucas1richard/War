import state from './state';
import { distance, pieceOptions, explosionImg } from './utils';
import { context } from './canvas';
import board from './board';
import player from './player';
import pieces from './pieces';
import Sound from './Sound';
import {EXPLODE, GAME_OVER} from '../constants';

const explosion = new Sound('/sound/explosion.mp3');

const { pieceSize } = state;

class Piece {
  constructor(id, type, team, coords, health) {
    if (!team) {
      throw new Error('Team must be specified');
    }
    if (!type) {
      throw new Error('Type must be specified');
    }
    this.id = id;
    this.type = type;
    this.team = team;

    this.x = coords.x;
    this.y = coords.y;
    this.isMoving = false;

    this.health = type === 'tank' ? 3 : 2;
    this.range = this.type === 'tank' ? 100 : 200;

    if (health) this.health = health;

    this.img = `/img/${type}-${team}`;
    this.icon = pieceOptions[`${type}-${team}`];
  }

  showRange() {
    this.isMoving = true;
    context.beginPath();
    context.strokeStyle = '#000000';
    context.fillStyle = 'rgba(0, 0, 255, 0.1)';
    context.arc(this.x + pieceSize / 2, this.y + pieceSize / 2, this.range, 0, 2 * Math.PI);
    context.fill();
  }

  isHit(explode) {
    if ((state.shotCanHit && this.team !== player.getTeam()) || explode) {
      this.explode();
      console.log('%cHit!', 'color: red; font-weight: bold;', this);
      this.health--;
      // console.log( `%cHealth reduced to ${this.health}`, 'color: blue; font-weight: bold');
      state.shotCanHit = false;
      if (!explode) {
        board.emit(EXPLODE, this.id);
      }
    }
  }

  explode(notBroadcast) {
    this.isExploding = true;
    this.icon = explosionImg;
    this.render();
    explosion.play();
    setTimeout(() => {
      this.icon = pieceOptions[`${this.type}-${this.team}`];
      if (this.health) {
        this.isExploding = false;
        board.render();
      } else {
        pieces.clearTheDead();
        board.render();
      }
      if (!pieces.checkSurvivors()) {
        board.emit(GAME_OVER, player.getTeam());
      }
    }, 500);
  }

  render(radius = 130) {
    if (!this.isExploding) {
      context.drawImage(this.icon, this.x, this.y, pieceSize, pieceSize);
    } else {
      context.drawImage(this.icon, this.x - (radius - pieceSize) / 2, this.y - (radius - pieceSize) / 2, radius, radius);
    }
    if (this.isMoving) this.showRange();
  }

  mouseOn({ x, y }) {
    if (this.team !== player.getTeam()) return false;
    return (
      x >= this.x && x <= this.x + pieceSize &&
      y >= this.y && y <= this.y + pieceSize
    );
  }

  moveTo({ x, y }, fn) {
    const dist = distance({ x: this.x + pieceSize / 2, y: this.y + pieceSize / 2 }, { x, y });
    if (dist < this.range) {
      this.x = x - pieceSize / 2;
      this.y = y - pieceSize / 2;
      this.isMoving = false;
      board.render();
      if (fn) fn();
    } else if (fn) {
      fn(`Position is too far: ${dist}`);
    }
  }
}

export default Piece;

