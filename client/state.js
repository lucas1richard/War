const state = {
  playerTeam: 'green',
  shotCanHit: true,
  pieceSize: 30,
  pieces: [],
  pieceToMove: null,
  action: 'shooting',
  shooting: false,
  currentMousePosition: { x: 0, y: 0 },
  lastMousePosition: { x: 0, y: 0 },
  drawStart: { x: 0, y: 0 },
  lastDistance: 0,
  shotStart: {},
  shotEnd: {},
  shot: []
};

export default state;
