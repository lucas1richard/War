export const distance = (_start, _end) => Math.sqrt(Math.pow(_end.x - _start.x, 2) + Math.pow(_end.y - _start.y, 2));

const droneRedImg = new Image();
droneRedImg.src = '/img/drone-red.png';

const droneGreenImg = new Image();
droneGreenImg.src = '/img/drone-green.png';

const tankRedImg = new Image();
tankRedImg.src = '/img/tank-red.png';

const tankGreenImg = new Image();
tankGreenImg.src = '/img/tank-green.png';

const scopeImg = new Image();
scopeImg.src = '/img/scope.png';

export const sandImg = new Image();
sandImg.src = '/img/sand.png';

export const explosionImg = new Image();
explosionImg.src = '/img/explosion.png';

export const pieceOptions = {
  'drone-red': droneRedImg,
  'drone-green': droneGreenImg,
  'tank-green': tankGreenImg,
  'tank-red': tankRedImg,
  explosion: explosionImg
};

