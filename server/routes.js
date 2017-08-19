const router = require('express').Router();
const path = require('path');
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

module.exports = function (io) {
  router.get('/:gamename', (req, res, next) => {
    io.emit('nsps', Object.keys(io.nsps).filter(nsp => {
      return Object
        .keys(io.nsps[nsp].sockets)
        .length === 1;
    }));

    const nsp = io.of('/' + req.params.gamename);

    if (!nsp._events) {

      nsp.on(CONNECTION, socket => {
        function createTeam() {
          let count = 1;
          return function () {
            if (count === 1) {
              count++;
              return 'green';
            }
            if (count === 2) {
              count++;
              return 'red';
            }
            count++;
          };
        }

        const random = len => Math.floor((len - 30) * Math.random());
        if (Object.keys(nsp.sockets).length > 2) {
          nsp
            .to(socket.id)
            .emit(GAME_IS_FULL);
          socket.disconnect();
        }
        let _state = {
          // playerTeam: 'green',
          shotCanHit: true,
          pieceSize: 30,
          pieces: [
            {
              id: 1,
              type: 'tank',
              team: 'green',
              x: random(900),
              y: random(600)
            }, {
              id: 2,
              type: 'drone',
              team: 'green',
              x: random(900),
              y: random(600)
            }, {
              id: 3,
              type: 'tank',
              team: 'red',
              x: random(900),
              y: random(600)
            }, {
              id: 4,
              type: 'drone',
              team: 'red',
              x: random(900),
              y: random(600)
            }, {
              id: 5,
              type: 'tank',
              team: 'green',
              x: random(900),
              y: random(600)
            }, {
              id: 6,
              type: 'drone',
              team: 'green',
              x: random(900),
              y: random(600)
            }, {
              id: 7,
              type: 'tank',
              team: 'red',
              x: random(900),
              y: random(600)
            }, {
              id: 8,
              type: 'drone',
              team: 'red',
              x: random(900),
              y: random(600)
            }, {
              id: 9,
              type: 'tank',
              team: 'green',
              x: random(900),
              y: random(600)
            }, {
              id: 10,
              type: 'tank',
              team: 'red',
              x: random(900),
              y: random(600)
            }, {
              id: 11,
              type: 'tank',
              team: 'green',
              x: random(900),
              y: random(600)
            }, {
              id: 12,
              type: 'tank',
              team: 'red',
              x: random(900),
              y: random(600)
            }
          ],
          pieceToMove: null,
          action: 'shooting',
          shooting: false,
          currentMousePosition: {
            x: 0,
            y: 0
          },
          lastMousePosition: {
            x: 0,
            y: 0
          },
          drawStart: {
            x: 0,
            y: 0
          },
          lastDistance: 0,
          shotStart: {},
          shotEnd: {}
        };

        const team = createTeam();

        // Update everone that a new client is on the server
        nsp
          .to(socket.id)
          .emit(PLAYER_HERE, Object.keys(nsp.sockets).length > 1);

        socket.on(STATE, state => {
          socket
            .broadcast
            .emit(STATE, Array.from(state));
        });

        socket.on(GAME_OVER, losingteam => nsp.emit(GAME_OVER, losingteam));

        if (Object.keys(nsp.sockets).length >= 2 && !Object.keys(nsp.sockets).filter(sck => nsp.sockets[sck].team).length) {
          let countdown = 3;
          let interval = setInterval(function () {
            nsp.emit(COUNT_DOWN, countdown);
            if (!countdown) {
              assignTeams();
              clearInterval(interval);
            }
            countdown--;
          }, 1000);

        }

        function assignTeams() {
          let tm = createTeam();
          Object
            .keys(nsp.sockets)
            .forEach(sck => {
              let tmpTm = tm();
              if (!nsp.sockets[sck].team) {
                nsp
                  .to(sck)
                  .emit(TEAM, tmpTm);
                nsp.sockets[sck].team = tmpTm;
              }
            });
        }

        socket.on(REQUEST_STATE, () => {
          socket.emit(SEED, _state);
        });

        require('./socketEm')(socket, nsp);
        
      });
    }
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
  return router;
};
