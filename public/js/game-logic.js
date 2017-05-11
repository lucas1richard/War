const pieceSize = 30;


var droneImg = new Image();
droneImg.src = '/img/drone.png';

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

var canvas = document.getElementById( 'viewport' );
var context = canvas.getContext( '2d' );

const pieceOptions = {
  drone: droneImg,
  'drone-red': droneRedImg,
  'drone-green': droneGreenImg,
  'tank-green': tankGreenImg,
  'tank-red': tankRedImg
};

var lastShot = [];

class Piece {
  constructor( id, type, team, coords ) {
    if ( !team ) {
      throw new Error( 'Team must be specified' );
    }
    if ( !type ) {
      throw new Error( 'Type must be specified' );
    }
    this.id = id;
    this.type = type;
    this.team = team;

    this.x = coords.x;
    this.y = coords.y;

    this.img = `/img/${type}-${team}`;
    this.icon = pieceOptions[ `${type}-${team}` ];
    this.place();
  }

  isHit() {
    this.hit = true;
  }

  place() {
    context.drawImage( this.icon, this.x, this.y, pieceSize, pieceSize );
  }
}

let pieces;

tankRedImg.onload = function () {

  pieces = [
    new Piece( 1, 'tank', 'green', {
      x: Math.floor( ( 900 - pieceSize ) * Math.random() ),
      y: Math.floor( ( 600 - pieceSize ) * Math.random() )
    } ),
    new Piece( 2, 'drone', 'green', {
      x: Math.floor( ( 900 - pieceSize ) * Math.random() ),
      y: Math.floor( ( 600 - pieceSize ) * Math.random() )
    } ),
    new Piece( 3, 'tank', 'red', {
      x: Math.floor( ( 900 - pieceSize ) * Math.random() ),
      y: Math.floor( ( 600 - pieceSize ) * Math.random() )
    } ),
    new Piece( 4, 'drone', 'red', {
      x: Math.floor( ( 900 - pieceSize ) * Math.random() ),
      y: Math.floor( ( 600 - pieceSize ) * Math.random() )
    } ),
  ];
};

function placeScope( {
  x,
  y
} ) {
  context.drawImage( scopeImg, x - pieceSize / 2, y - pieceSize / 2, pieceSize, pieceSize );
}

function addPieces() {
  pieces.forEach( pc => pc.place() );
}

class EventEmitter {
  constructor() {
    this.subscribers = {};
  }
  on( eventName, eventListener ) {
    if ( !this.subscribers[ eventName ] ) {
      this.subscribers[ eventName ] = [];
    }
    this.subscribers[ eventName ].push( eventListener );
  }
  emit( eventName ) {
    if ( !this.subscribers[ eventName ] ) return;

    const remainingArgs = [].slice.call( arguments, 1 );
    this.subscribers[ eventName ].forEach( function ( listener ) {
      listener.apply( null, remainingArgs );
    } );
  }
}

var whiteboard = new EventEmitter();

function resize() {
  context.setTransform( 1, 0, 0, 1, 0, 0 );
  const pixelRatio = window.devicePixelRatio || 1;

  let w = canvas.clientWidth * pixelRatio,
    h = canvas.clientHeight * pixelRatio;
  if ( w !== canvas.width || h !== canvas.height ) {
    var imgData = context.getImageData( 0, 0, canvas.width, canvas.height );

    canvas.width = w;
    canvas.height = h;

    context.putImageData( imgData, 0, 0 );
  }

  context.scale( pixelRatio, pixelRatio );

  context.lineWidth = 5;
  context.lineJoin = 'round';
  context.lineCap = 'round';
}

// resize();

var shooting = false;
var currentMousePosition = {
    x: 0,
    y: 0
  },
  lastMousePosition = {
    x: 0,
    y: 0
  };

droneImg.onload = function () {
  context.drawImage( droneImg, 10, 10, pieceSize, pieceSize );
  context.drawImage( droneImg, 60, 60, pieceSize, pieceSize );
};

let drawStart = {
  x: 0,
  y: 0
};
let lastDistance = 0;
let startTime, endTime;

canvas.addEventListener( 'mousedown', function ( ev ) {
  lastShot = [];
  shooting = true;
  currentMousePosition.x = ev.pageX - this.offsetLeft;
  currentMousePosition.y = ev.pageY - this.offsetTop;
  drawStart = Object.assign( {}, currentMousePosition );
  lastDistance = 0;
  // context.lineWidth = 5;
  startTime = new Date();
} );

function distance( _start, _end ) {
  return Math.sqrt( Math.pow( _end.x - _start.x, 2 ) + Math.pow( _end.y - _start.y, 2 ) );
}

canvas.addEventListener( 'mouseup', function () {
  shooting = false;
} );

canvas.addEventListener( 'mousemove', function ( ev ) {
  whiteboard.clear();
  addPieces();

  const mousePos = {
    x: ev.pageX - this.offsetLeft,
    y: ev.pageY - this.offsetTop
  };

  placeScope( mousePos );

  if ( shooting ) {
    lastPosition = Object.assign({}, currentMousePosition);
    currentMousePosition = mousePos;

    whiteboard.shoot( lastMousePosition, currentMousePosition, pieces );
  } else {
    pieces.forEach( pc => {
      if ( distance( pc, mousePos ) < 30 ) {
        placeScope( pc );
      }
    } );
  }
} );

canvas.addEventListener( 'touchend', function () {
  let mouseEvent = new MouseEvent( 'mouseup', {} );
  canvas.dispatchEvent( mouseEvent );
} );

function drawShot() {
  lastShot.forEach( shot => {
    context.beginPath();
    context.strokeStyle = shot.strokeStyle;
    context.moveTo( shot.start.x, shot.start.y );
    context.lineTo( shot.end.x, shot.end.y );
    context.closePath();
    context.stroke();
  } );
}

whiteboard.shoot = function ( start, end, targets, shouldBroadcast ) {
  context.save();
  const dist = distance( drawStart, end );
  endTime = new Date();
  if ( dist > 250 || dist < lastDistance ) return;
  if ( endTime - startTime > 500 ) return;
  lastDistance = dist;

  lastShot.push( {
    start,
    end,
    strokeStyle: `rgba(1, 1, 0, ${1 - (dist) / 250})`
  } );

  targets.forEach( trg => {
    if ( hit( trg ) ) {
      console.log( '%c Hit!', 'color: red; font-weight: bold;', trg );
      trg.isHit();
      pieces = pieces.filter( pc => !pc.hit );
      whiteboard.clear();
      pieces.forEach( pc => pc.place() );
    }
  } );

  if ( shouldBroadcast ) {
    whiteboard.emit( 'shoot', start, end );
  }

  function hit( target ) {
    if ( start.x === end.x || start.y === end.y ) return false;
    const fn = ( x, y ) => ( end.y - start.y ) * x + ( start.x - end.x ) * y + ( end.x * start.y - start.x * end.y );
    let corners = [ fn( target.x, target.y ), fn( target.x + pieceSize, target.y ), fn( target.x, target.y + pieceSize ), fn( target.x + pieceSize, target.y + pieceSize ) ];
    if ( corners.filter( crn => crn === 0 ).length ) return true;
    if ( corners.filter( crn => crn > 0 ).length === 4 ) return false;
    if ( corners.filter( crn => crn < 0 ).length === 4 ) return false;

    return !(
      ( start.x > target.x + pieceSize && end.x > target.x + pieceSize ) || ( start.x < target.x && end.x < target.x ) ||
      ( start.y > target.y + pieceSize && end.y > target.y + pieceSize ) || ( start.y < target.y && end.y < target.y )
    );
  }
};

whiteboard.clear = function ( shouldBroadcast ) {
  context.clearRect( 0, 0, canvas.width, canvas.height );
  if ( shouldBroadcast ) whiteboard.emit( 'clear' );
};

