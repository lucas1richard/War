const {
  CONNECTION,
  COUNT_DOWN,
  DISCONNECT,
  DISCONNECTED,
  EXPLODE,
  GAME_IS_FULL,
  GAME_OVER,
  MOUSE_MOVE,
  PLAYER_HERE,
  STATE,
  REQUEST_STATE,
  SEED,
  SHOOT,
  SHOW_RANGE,
  TEAM,
} = require('../constants');

module.exports = (sck, namespace) => {
  sck.on(DISCONNECT, () => {
    namespace.emit(DISCONNECTED);
  });
  sck.on(EXPLODE, id => {
    sck.broadcast.emit(EXPLODE, id);
  });
  sck.on(MOUSE_MOVE, pos => {
    sck.broadcast.emit(MOUSE_MOVE, pos);
  });
  sck.on(SHOOT, shot => {
    sck.broadcast.emit(SHOOT, shot);
  });
  sck.on(SHOW_RANGE, id => {
    sck.broadcast.emit(SHOW_RANGE, id);
  });
};