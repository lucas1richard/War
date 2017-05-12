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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
  playerTeam: null,
  shotCanHit: true,
  pieceSize: 30,
  pieces: [],
  pieceToMove: null,
  action: 'shooting',
  shooting: false,
  currentMousePosition: { x: 0, y: 0 },
  lastMousePosition: { x: 0, y: 0 }
};

exports.default = state;

/***/ }),
/* 1 */
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

var sandImg = new Image();
sandImg.src = '/img/sand.png';

var explosionImg = new Image();
explosionImg.src = '/img/explosion.png';

var pieceOptions = exports.pieceOptions = {
  'drone-red': droneRedImg,
  'drone-green': droneGreenImg,
  'tank-green': tankGreenImg,
  'tank-red': tankRedImg,
  explosion: explosionImg
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _state = __webpack_require__(0);

var _state2 = _interopRequireDefault(_state);

var _utils = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pieceSize = _state2.default.pieceSize;

var Piece = function () {
  function Piece(id, type, team, coords) {
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

    this.health = type === 'tank' ? 3 : 2;
    this.range = this.type === 'tank' ? 100 : 200;

    this.img = '/img/' + type + '-' + team;
    this.icon = pieceOptions[type + '-' + team];
  }

  _createClass(Piece, [{
    key: 'showRange',
    value: function showRange() {
      context.beginPath();
      context.strokeStyle = '#000000';
      context.fillStyle = 'rgba(0, 0, 255, 0.1)';
      context.arc(this.x + pieceSize / 2, this.y + pieceSize / 2, this.range, 0, 2 * Math.PI);
      context.fill();
    }
  }, {
    key: 'isHit',
    value: function isHit() {
      if (_state2.default.shotCanHit && this.team !== _state2.default.playerTeam) {
        console.log('%c Hit!', 'color: red; font-weight: bold;', this);
        this.health--;
        _state2.default.shotCanHit = !_state2.default.shotCanHit;
        this.explode();
      }
    }
  }, {
    key: 'explode',
    value: function explode() {
      var _this = this;

      this.isExploding = true;
      this.icon = explosionImg;
      this.render(this.health ? 80 : 130);
      setTimeout(function () {
        _this.icon = pieceOptions[_this.type + '-' + _this.team];
        if (_this.health) {
          _this.isExploding = false;
          board.render();
        } else {
          pieces = pieces.filter(function (pc) {
            return pc.health;
          });
          board.render();
        }
      }, 500);
    }
  }, {
    key: 'render',
    value: function render() {
      var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 130;

      if (!this.isExploding) {
        context.drawImage(this.icon, this.x, this.y, pieceSize, pieceSize);
      } else {
        context.drawImage(this.icon, this.x - (radius - pieceSize) / 2, this.y - (radius - pieceSize) / 2, radius, radius);
      }
    }
  }, {
    key: 'mouseOn',
    value: function mouseOn(_ref) {
      var x = _ref.x,
          y = _ref.y;

      if (this.team !== _state2.default.playerTeam) return false;
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
        board.render();
        fn();
      } else {
        fn('Position is too far: ' + dist);
      }
    }
  }]);

  return Piece;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _state = __webpack_require__(0);

var _state2 = _interopRequireDefault(_state);

var _utils = __webpack_require__(1);

var _Piece = __webpack_require__(2);

var _Piece2 = _interopRequireDefault(_Piece);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var board = new EventEmitter();

var canvas = document.getElementById('viewport');
var context = canvas.getContext('2d');

var shootBtn = document.getElementById('shoot');
var moveBtn = document.getElementById('move');

shootBtn.addEventListener('click', function () {
  canvas.className = 'shooting';
  this.className = 'btn btn-default active';
  moveBtn.className = 'btn btn-default';
  _state2.default.action = 'shooting';
});

moveBtn.addEventListener('click', function () {
  canvas.className = 'moving';
  this.className = 'btn btn-default active';
  shootBtn.className = 'btn btn-default';
  _state2.default.action = 'moving';
});

_utils.sandImg.onload = function () {
  context.drawImage(_utils.sandImg, 0, 0, 900, 600);

  _state2.default.pieces = [new _Piece2.default(1, 'tank', 'green', {
    x: Math.floor((900 - _state2.default.pieceSize) * Math.random()),
    y: Math.floor((600 - _state2.default.pieceSize) * Math.random())
  }), new _Piece2.default(2, 'drone', 'green', {
    x: Math.floor((900 - _state2.default.pieceSize) * Math.random()),
    y: Math.floor((600 - _state2.default.pieceSize) * Math.random())
  }), new _Piece2.default(3, 'tank', 'red', {
    x: Math.floor((900 - _state2.default.pieceSize) * Math.random()),
    y: Math.floor((600 - _state2.default.pieceSize) * Math.random())
  }), new _Piece2.default(4, 'drone', 'red', {
    x: Math.floor((900 - _state2.default.pieceSize) * Math.random()),
    y: Math.floor((600 - _state2.default.pieceSize) * Math.random())
  })];

  board.render();
};

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map