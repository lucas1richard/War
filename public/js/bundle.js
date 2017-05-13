/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var state = {
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

exports.default = state;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var canvas = exports.canvas = document.getElementById('viewport');
var context = exports.context = canvas.getContext('2d');

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _state = __webpack_require__(0);

var _state2 = _interopRequireDefault(_state);

var _Piece = __webpack_require__(7);

var _Piece2 = _interopRequireDefault(_Piece);

var _player = __webpack_require__(5);

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pieces = {

  _pieces: [],

  setPieces: function setPieces(piecesToSet) {
    this._pieces = piecesToSet.map(function (pc) {
      return new _Piece2.default(pc.id, pc.type, pc.team, { x: pc.x, y: pc.y }, pc.health);
    });
  },
  findById: function findById(id) {
    var pc = this._pieces.filter(function (p) {
      return p.id === id;
    })[0];
    if (pc) return pc;
    console.error('There is no piece with id ' + id);
  },
  addNewPiece: function addNewPiece(type, team, coords) {
    if (!coords) {
      coords = {
        x: Math.floor((900 - _state2.default.pieceSize) * Math.random()),
        y: Math.floor((600 - _state2.default.pieceSize) * Math.random())
      };
    }
    var maxId = this._pieces.reduce(function (mx, pc) {
      return pc.id > mx ? pc.id : mx;
    }, 0);
    this._pieces.push(new _Piece2.default(maxId + 1, type, team, coords));
  },
  clearTheDead: function clearTheDead() {
    this._pieces = this._pieces.filter(function (pc) {
      return pc.health;
    });
  },
  renderAll: function renderAll() {
    this._pieces.forEach(function (pc) {
      return pc.render();
    });
  },
  getAll: function getAll() {
    return this._pieces;
  },
  moveAllTo: function moveAllTo(idCoords) {
    this._pieces = idCoords.map(function (js) {
      return new _Piece2.default(js.id, js.type, js.team, { x: js.x, y: js.y }, js.health);
    });
  },
  checkSurvivors: function checkSurvivors() {
    return this._pieces.filter(function (pc) {
      return pc.team === _player2.default.getTeam();
    }).length;
  }
};

exports.default = pieces;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var distance = exports.distance = function distance(_start, _end) {
  return Math.sqrt(Math.pow(_end.x - _start.x, 2) + Math.pow(_end.y - _start.y, 2));
};

var droneRedImg = new Image();
droneRedImg.src = '/img/drone-red.png';

var droneGreenImg = new Image();
droneGreenImg.src = '/img/drone-green.png';

var tankRedImg = new Image();
tankRedImg.src = '/img/tank-red.png';

var tankGreenImg = new Image();
tankGreenImg.src = '/img/tank-green.png';

var scopeImg = new Image();
scopeImg.src = '/img/scope.png';

var sandImg = exports.sandImg = new Image();
sandImg.src = '/img/sand.png';

var explosionImg = exports.explosionImg = new Image();
explosionImg.src = '/img/explosion.png';

var pieceOptions = exports.pieceOptions = {
  'drone-red': droneRedImg,
  'drone-green': droneGreenImg,
  'tank-green': tankGreenImg,
  'tank-red': tankRedImg,
  explosion: explosionImg
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventEmitter = __webpack_require__(6);

var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

var _state = __webpack_require__(0);

var _state2 = _interopRequireDefault(_state);

var _utils = __webpack_require__(3);

var _canvas = __webpack_require__(1);

var _pieces = __webpack_require__(2);

var _pieces2 = _interopRequireDefault(_pieces);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pieceSize = _state2.default.pieceSize;


var board = new _EventEmitter2.default();

board.clear = function (shouldBroadcast) {
  _canvas.context.clearRect(0, 0, _canvas.canvas.width, _canvas.canvas.height);
  if (shouldBroadcast) board.emit('clear');
};

board.render = function (shouldBroadcast) {
  _state2.default.shotCanHit = true;
  board.clear();
  _canvas.context.save();
  _canvas.context.globalAlpha = 0.6;
  _canvas.context.drawImage(_utils.sandImg, 0, 0, 900, 600);
  _canvas.context.restore();
  _pieces2.default.renderAll();
  _state2.default.shot.forEach(function (shot) {
    return board.drawShot(shot);
  });
  if (!shouldBroadcast) board.emit('render', _state2.default);
};

board.shoot = function (start, end, targets, shouldBroadcast) {
  if (_state2.default.action !== 'shooting') return;
  var dist = (0, _utils.distance)(_state2.default.drawStart, end);
  _state2.default.shotEnd = new Date();
  if (dist > 300 || dist < _state2.default.lastDistance) return;
  if (_state2.default.shotEnd - _state2.default.shotStart > 150) return;
  _state2.default.lastDistance = dist;

  board.drawShot({ start: start, end: end, strokeStyle: 'rgba(1, 1, 0, ' + (1 - dist / 250) + ')' });

  targets.forEach(function (trg) {
    if (hit(trg)) {
      trg.isHit();
    }
  });

  _state2.default.shot.push({ start: start, end: end, strokeStyle: 'rgba(1, 1, 0, ' + (1 - dist / 250) + ')' });

  board.emit('shoot', { start: start, end: end, strokeStyle: 'rgba(1, 1, 0, ' + (1 - dist / 250) + ')' });

  function hit(target) {
    if (start.x === end.x || start.y === end.y) return false;

    var fn = function fn(x, y) {
      return (end.y - start.y) * x + (start.x - end.x) * y + (end.x * start.y - start.x * end.y);
    };

    var corners = [fn(target.x, target.y), fn(target.x + pieceSize, target.y), fn(target.x, target.y + pieceSize), fn(target.x + pieceSize, target.y + pieceSize)];
    if (corners.filter(function (crn) {
      return crn === 0;
    }).length) return true;
    if (corners.filter(function (crn) {
      return crn > 0;
    }).length === 4) return false;
    if (corners.filter(function (crn) {
      return crn < 0;
    }).length === 4) return false;

    return !(start.x > target.x + pieceSize && end.x > target.x + pieceSize || start.x < target.x && end.x < target.x || start.y > target.y + pieceSize && end.y > target.y + pieceSize || start.y < target.y && end.y < target.y);
  }
};
board.drawShot = function (shot) {
  _canvas.context.beginPath();
  _canvas.context.strokeStyle = shot.strokeStyle;
  _canvas.context.moveTo(shot.start.x, shot.start.y);
  _canvas.context.lineTo(shot.end.x, shot.end.y);
  _canvas.context.closePath();
  _canvas.context.stroke();
};

exports.default = board;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
window.player = {
  team: null,
  getTeam: function getTeam() {
    return this.team;
  },
  setTeam: function setTeam(team) {
    if (!this.team) {
      this.team = team;
      var footer = document.getElementById('footer');
      footer.innerText = team.charAt(0).toUpperCase() + team.slice(1) + ' Team';
      footer.style.color = team;
      footer.style.fontWeight = 'bold';
      return this.team;
    } else {
      console.error('Team is already set to ' + this.team);
    }
  }
};

exports.default = window.player;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this.subscribers = {};
  }

  _createClass(EventEmitter, [{
    key: "on",
    value: function on(eventName, eventListener) {
      if (!this.subscribers[eventName]) {
        this.subscribers[eventName] = [];
      }
      this.subscribers[eventName].push(eventListener);
    }
  }, {
    key: "emit",
    value: function emit(eventName) {
      if (!this.subscribers[eventName]) return;

      var remainingArgs = [].slice.call(arguments, 1);
      this.subscribers[eventName].forEach(function (listener) {
        listener.apply(null, remainingArgs);
      });
    }
  }]);

  return EventEmitter;
}();

exports.default = EventEmitter;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _state = __webpack_require__(0);

var _state2 = _interopRequireDefault(_state);

var _utils = __webpack_require__(3);

var _canvas = __webpack_require__(1);

var _board = __webpack_require__(4);

var _board2 = _interopRequireDefault(_board);

var _player = __webpack_require__(5);

var _player2 = _interopRequireDefault(_player);

var _pieces = __webpack_require__(2);

var _pieces2 = _interopRequireDefault(_pieces);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pieceSize = _state2.default.pieceSize;

var Piece = function () {
  function Piece(id, type, team, coords, health) {
    _classCallCheck(this, Piece);

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

    this.img = '/img/' + type + '-' + team;
    this.icon = _utils.pieceOptions[type + '-' + team];
  }

  _createClass(Piece, [{
    key: 'showRange',
    value: function showRange() {
      this.isMoving = true;
      _canvas.context.beginPath();
      _canvas.context.strokeStyle = '#000000';
      _canvas.context.fillStyle = 'rgba(0, 0, 255, 0.1)';
      _canvas.context.arc(this.x + pieceSize / 2, this.y + pieceSize / 2, this.range, 0, 2 * Math.PI);
      _canvas.context.fill();
    }
  }, {
    key: 'isHit',
    value: function isHit(explode) {
      if (_state2.default.shotCanHit && this.team !== _player2.default.getTeam() || explode) {
        this.explode();
        console.log('%cHit!', 'color: red; font-weight: bold;', this);
        this.health--;
        console.log('%cHealth reduced to ' + this.health, 'color: blue; font-weight: bold');
        _state2.default.shotCanHit = false;
        if (!explode) {
          _board2.default.emit('explode', this.id);
        }
      }
    }
  }, {
    key: 'explode',
    value: function explode(notBroadcast) {
      var _this = this;

      this.isExploding = true;
      this.icon = _utils.explosionImg;
      this.render();
      setTimeout(function () {
        _this.icon = _utils.pieceOptions[_this.type + '-' + _this.team];
        if (_this.health) {
          _this.isExploding = false;
          _board2.default.render();
        } else {
          _pieces2.default.clearTheDead();
          _board2.default.render();
        }
        if (!_pieces2.default.checkSurvivors()) {
          _board2.default.emit('gameover', _player2.default.getTeam());
        }
      }, 500);
    }
  }, {
    key: 'render',
    value: function render() {
      var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 130;

      if (!this.isExploding) {
        _canvas.context.drawImage(this.icon, this.x, this.y, pieceSize, pieceSize);
      } else {
        _canvas.context.drawImage(this.icon, this.x - (radius - pieceSize) / 2, this.y - (radius - pieceSize) / 2, radius, radius);
      }
      if (this.isMoving) this.showRange();
    }
  }, {
    key: 'mouseOn',
    value: function mouseOn(_ref) {
      var x = _ref.x,
          y = _ref.y;

      if (this.team !== _player2.default.getTeam()) return false;
      return x >= this.x && x <= this.x + pieceSize && y >= this.y && y <= this.y + pieceSize;
    }
  }, {
    key: 'moveTo',
    value: function moveTo(_ref2, fn) {
      var x = _ref2.x,
          y = _ref2.y;

      var dist = (0, _utils.distance)({ x: this.x + pieceSize / 2, y: this.y + pieceSize / 2 }, { x: x, y: y });
      if (dist < this.range) {
        this.x = x - pieceSize / 2;
        this.y = y - pieceSize / 2;
        this.isMoving = false;
        _board2.default.render();
        if (fn) fn();
      } else if (fn) {
        fn('Position is too far: ' + dist);
      }
    }
  }]);

  return Piece;
}();

exports.default = Piece;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _state2 = __webpack_require__(0);

var _state3 = _interopRequireDefault(_state2);

var _utils = __webpack_require__(3);

var _board2 = __webpack_require__(4);

var _board3 = _interopRequireDefault(_board2);

var _player = __webpack_require__(5);

var _player2 = _interopRequireDefault(_player);

var _pieces = __webpack_require__(2);

var _pieces2 = _interopRequireDefault(_pieces);

var _canvas = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

window.addEventListener('keydown', btnPress, false);

var othermouse = document.getElementById('othermouse');

function btnPress(ev) {
  if (ev.keyCode === 32) {
    if (_canvas.canvas.className === 'shooting') {
      _canvas.canvas.className = 'moving';
      _state3.default.action = 'moving';
    } else {
      _canvas.canvas.className = 'shooting';
      _state3.default.action = 'shooting';
    }
  }
}

function resize() {
  // Unscale the canvas (if it was previously scaled)
  _canvas.context.setTransform(1, 0, 0, 1, 0, 0);

  // The device pixel ratio is the multiplier between CSS pixels
  // and device pixels
  var pixelRatio = window.devicePixelRatio || 1;

  // Allocate backing store large enough to give us a 1:1 device pixel
  // to canvas pixel ratio.
  var w = _canvas.canvas.clientWidth * pixelRatio,
      h = _canvas.canvas.clientHeight * pixelRatio;
  if (w !== _canvas.canvas.width || h !== _canvas.canvas.height) {
    // Resizing the canvas destroys the current content.
    // So, save it...
    var imgData = _canvas.context.getImageData(0, 0, _canvas.canvas.width, _canvas.canvas.height);

    _canvas.canvas.width = w;_canvas.canvas.height = h;

    // ...then restore it.
    _canvas.context.putImageData(imgData, 0, 0);
  }

  // Scale the canvas' internal coordinate system by the device pixel
  // ratio to ensure that 1 canvas unit = 1 css pixel, even though our
  // backing store is larger.
  _canvas.context.scale(pixelRatio, pixelRatio);

  // context.lineWidth = 5;
  _canvas.context.lineJoin = 'round';
  _canvas.context.lineCap = 'round';
}

resize();

_canvas.canvas.addEventListener('mouseup', function () {
  _state3.default.shooting = false;
});

_canvas.canvas.addEventListener('mousemove', function (ev) {
  var mousePos = {
    x: ev.pageX - this.offsetLeft,
    y: ev.pageY - this.offsetTop
  };

  _board3.default.emit('mousemove', mousePos);

  if (_state3.default.shooting) {
    _state3.default.lastMousePosition = Object.assign({}, _state3.default.currentMousePosition);
    _state3.default.currentMousePosition = mousePos;

    _board3.default.shoot(_state3.default.lastMousePosition, _state3.default.currentMousePosition, _pieces2.default.getAll());
  } else {
    // pieces.forEach( pc => {
    //   if ( distance( pc, mousePos ) < 30 ) {
    //     placeScope( pc );
    //   }
    // } );
  }
});

_canvas.canvas.addEventListener('mousedown', function (ev) {
  _state3.default.shot = [];
  var mousePos = {
    x: ev.pageX - this.offsetLeft,
    y: ev.pageY - this.offsetTop
  };
  if (_state3.default.action === 'shooting') {
    _state3.default.shotCanHit = true;
    _pieces2.default.getAll().forEach(function (pc) {
      if (pc.mouseOn(mousePos)) {
        _state3.default.shooting = true;
      }
    });
  }

  if (_state3.default.action === 'moving') {
    _state3.default.moving = true;
    if (!_state3.default.pieceToMove) {
      _pieces2.default.getAll().forEach(function (pc) {
        if (pc.mouseOn(mousePos)) {
          _state3.default.pieceToMove = pc;
          _state3.default.pieceToMove.showRange();
        }
      });
    } else {
      if (_state3.default.pieceToMove) {
        _pieces2.default.findById(_state3.default.pieceToMove.id).moveTo(mousePos, function (err) {
          if (!err) {
            _state3.default.pieceToMove = null;
          } else {
            console.error(err);
          }
        });
      }
    }
  }

  _state3.default.currentMousePosition = Object.assign({}, mousePos);

  _state3.default.drawStart = Object.assign({}, _state3.default.currentMousePosition);
  _state3.default.lastDistance = 0;
  _state3.default.shotStart = new Date();
});

var socket = io(window.location.origin);

_board3.default.on('render', function () {
  socket.emit('state', _pieces2.default.getAll());
});
_board3.default.on('clear', function () {
  return socket.emit('clear');
});
_board3.default.on('shoot', function (shot) {
  return socket.emit('shoot', shot);
});
_board3.default.on('showRange', function (id) {
  return socket.emit('showRange', id);
});
_board3.default.on('mousemove', function (pos) {
  return socket.emit('mousemove', pos);
});

_board3.default.on('explode', function (id) {
  return socket.emit('explode', id);
});
_board3.default.on('gameover', function (team) {
  return socket.emit('gameover', team);
});

socket.on('gameover', function (team) {
  if (_player2.default.getTeam() === team) {
    alert('You lose');
  } else {
    alert('You win');
  }
});

socket.on('draw', function (_board) {
  return _board3.default.draw.apply(_board3.default, _toConsumableArray(Object.values(_board)));
});
socket.on('shoot', function (shot) {
  return _board3.default.drawShot(shot);
});
socket.on('explode', function (id) {
  _pieces2.default.getAll().forEach(function (pc) {
    if (pc.id === id) {
      console.log(pc);
      pc.isHit(true);
    }
  });
});

socket.on('mousemove', function (pos) {
  othermouse.style.top = pos.y - 7 + 'px';
  othermouse.style.left = pos.x - 7 + 'px';
});

socket.on('showRange', function (id) {
  _pieces2.default.getAll().forEach(function (pc) {
    if (pc.id === id) pc.showRange();
  });
});

socket.on('seed', function (_state) {
  delete _state.playerTeam;
  Object.assign(_state3.default, _state);
  _pieces2.default.setPieces(_state3.default.pieces);
  _board3.default.render();
});

socket.on('playerHere', function (playerHere) {
  console.log(playerHere);
  if (playerHere) {
    socket.emit('requestState');
    _state3.default.playerTeam = 'red';
  } else {
    _canvas.context.drawImage(_utils.sandImg, 0, 0, 900, 600);
    var random = function random(len) {
      return Math.floor((len - _state3.default.pieceSize) * Math.random());
    };
    _pieces2.default.setPieces([{ id: 1, type: 'tank', team: 'green', x: random(900), y: random(600) }, { id: 2, type: 'drone', team: 'green', x: random(900), y: random(600) }, { id: 3, type: 'tank', team: 'red', x: random(900), y: random(600) }, { id: 4, type: 'drone', team: 'red', x: random(900), y: random(600) }, { id: 5, type: 'tank', team: 'green', x: random(900), y: random(600) }, { id: 6, type: 'drone', team: 'green', x: random(900), y: random(600) }, { id: 7, type: 'tank', team: 'red', x: random(900), y: random(600) }, { id: 8, type: 'drone', team: 'red', x: random(900), y: random(600) }]);

    _board3.default.render(true);
  }
});

socket.on('state', function (_state) {
  // Object.assign( state, _state );
  // state.pieces = state.pieces.map( js => new Piece( js.id, js.type, js.team, { x: js.x, y: js.y }, js.health ) );
  _pieces2.default.moveAllTo(_state);
  _state3.default.action = 'shooting';
  _board3.default.render(true);
});

socket.on('clear', _board3.default.clear);

socket.on('team', function (team) {
  console.log('team', team);
  if (team) {
    _state3.default.playerTeam = team;
    _player2.default.setTeam(team);
  }
});

// let numTracker = (function() {
//   var div = document.getElementById('userCount');
//   return num => {
//       div.innerText = num !== 1 ? `${num} users` : `1 user`;
//       div.style.fontWeight = 'bold';
//       div.style.color = 'red';
//       setTimeout(function() {
//         div.style.fontWeight = 'initial';
//         div.style.color = 'initial';
//       }, 750);
//     };
// })();

// socket.on('usercount', numTracker);

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map