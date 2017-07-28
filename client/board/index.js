
import EventEmitter from '../EventEmitter';
import state from '../state';
import { sandImg, distance } from '../utils';
import { canvas, context } from '../canvas';
import pieces from '../pieces';

let { pieceSize } = state;

const board = new EventEmitter();

board.clear = function (shouldBroadcast) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (shouldBroadcast) board.emit('clear');
};

board.render = function (shouldBroadcast) {
  state.shotCanHit = true;
  board.clear();
  context.save();
  context.globalAlpha = 0.6;
  context.drawImage(sandImg, 0, 0, 900, 600);
  context.restore();
  pieces.renderAll();
  state.shot.forEach(shot => board.drawShot(shot));
  if (!shouldBroadcast) board.emit('render', state);
};

board.shoot = function (start, end, targets, shouldBroadcast) {
  if (state.action !== 'shooting') return;
  const dist = distance(state.drawStart, end);
  state.shotEnd = new Date();
  if (dist > 300 || dist < state.lastDistance) return;
  if (state.shotEnd - state.shotStart > 150) return;
  state.lastDistance = dist;

  board.drawShot({ start, end, strokeStyle: `rgba(1, 1, 0, ${1 - (dist) / 250})` });

  targets.forEach(trg => {
    if (hit(trg)) {
      trg.isHit();
    }
  });

  state.shot.push({ start, end, strokeStyle: `rgba(1, 1, 0, ${1 - (dist) / 250})` });

  board.emit('shoot', { start, end, strokeStyle: `rgba(1, 1, 0, ${1 - (dist) / 250})` });

  function hit(target) {
    if (start.x === end.x || start.y === end.y) return false;

    const fn = (x, y) => (end.y - start.y) * x + (start.x - end.x) * y + (end.x * start.y - start.x * end.y);

    let corners = [fn(target.x, target.y), fn(target.x + pieceSize, target.y), fn(target.x, target.y + pieceSize), fn(target.x + pieceSize, target.y + pieceSize)];
    if (corners.filter(crn => crn === 0).length) return true;
    if (corners.filter(crn => crn > 0).length === 4) return false;
    if (corners.filter(crn => crn < 0).length === 4) return false;

    return !(
      (start.x > target.x + pieceSize && end.x > target.x + pieceSize) || (start.x < target.x && end.x < target.x) ||
      (start.y > target.y + pieceSize && end.y > target.y + pieceSize) || (start.y < target.y && end.y < target.y)
    );
  }
};

board.drawShot = shot => {
  context.beginPath();
  context.strokeStyle = shot.strokeStyle;
  context.moveTo(shot.start.x, shot.start.y);
  context.lineTo(shot.end.x, shot.end.y);
  context.closePath();
  context.stroke();
};


export default board;

