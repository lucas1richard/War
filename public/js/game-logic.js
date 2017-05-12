(function() {

  // const pieceSize = 30;

  // var droneRedImg = new Image();
  // droneRedImg.src = '/img/drone-red.png';

  // var droneGreenImg = new Image();
  // droneGreenImg.src = '/img/drone-green.png';

  // var tankRedImg = new Image();
  // tankRedImg.src = '/img/tank-red.png';

  // var tankGreenImg = new Image();
  // tankGreenImg.src = '/img/tank-green.png';

  // var scopeImg = new Image();
  // scopeImg.src = '/img/scope.png';

  // var sandImg = new Image();
  // sandImg.src = '/img/sand.png';

  // var explosionImg = new Image();
  // explosionImg.src = '/img/explosion.png';

  // var canvas = document.getElementById( 'viewport' );
  // var context = canvas.getContext( '2d' );

  // sandImg.onload = function() {
  //   context.drawImage(sandImg, 0, 0, 900, 600);
  // };

  // const pieceOptions = {
  //   'drone-red': droneRedImg,
  //   'drone-green': droneGreenImg,
  //   'tank-green': tankGreenImg,
  //   'tank-red': tankRedImg
  // };

  // const playerTeam = 'green';

  // var action = 'shooting';
  // let shotCanHit = true;

  // var shootBtn = document.getElementById( 'shoot' );
  // var moveBtn = document.getElementById( 'move' );

  // shootBtn.addEventListener( 'click', function () {
  //   canvas.className = 'shooting';
  //   this.className = 'btn btn-default active';
  //   moveBtn.className = 'btn btn-default';
  //   action = 'shooting';
  // } );

  // moveBtn.addEventListener( 'click', function () {
  //   canvas.className = 'moving';
  //   this.className = 'btn btn-default active';
  //   shootBtn.className = 'btn btn-default';
  //   action = 'moving';
  // } );

  // class Piece {
  //   constructor( id, type, team, coords ) {
  //     if ( !team ) {
  //       throw new Error( 'Team must be specified' );
  //     }
  //     if ( !type ) {
  //       hit
  //       throw new Error( 'Type must be specified' );
  //     }
  //     this.id = id;
  //     this.type = type;
  //     this.team = team;

  //     this.x = coords.x;
  //     this.y = coords.y;

  //     this.health = type === 'tank' ? 3 : 2;
  //     this.range = this.type === 'tank' ? 100 : 200;

  //     this.img = `/img/${type}-${team}`;
  //     this.icon = pieceOptions[ `${type}-${team}` ];
  //   }

  //   showRange() {
  //     context.beginPath();
  //     context.strokeStyle = '#000000';
  //     context.fillStyle = 'rgba(0, 0, 255, 0.1)';
  //     context.arc( this.x + pieceSize / 2, this.y + pieceSize / 2, this.range, 0, 2 * Math.PI );
  //     context.fill();
  //   }

  //   isHit() {
  //     if ( shotCanHit && this.team !== playerTeam ) {
  //       console.log( '%c Hit!', 'color: red; font-weight: bold;', this );
  //       this.health--;
  //       shotCanHit = !shotCanHit;
  //       this.explode();
  //     }
  //   }

  //   explode() {
  //     this.isExploding = true;
  //     this.icon = explosionImg;
  //     this.render(this.health ? 80 : 130);
  //     setTimeout(() => {
  //       this.icon = pieceOptions[ `${this.type}-${this.team}` ];
  //       if (this.health) {
  //         this.isExploding = false;
  //         board.render();
  //       } else {
  //         pieces = pieces.filter( pc => pc.health );
  //         board.render();
  //       }
  //     }, 500);
  //   }

  //   render(radius = 130) {
  //     if (!this.isExploding) {
  //       context.drawImage( this.icon, this.x, this.y, pieceSize, pieceSize );
  //     } else {
  //       context.drawImage( this.icon, this.x - (radius - pieceSize)/2, this.y - (radius - pieceSize)/2, radius, radius );
  //     }
  //   }

  //   mouseOn( { x, y } ) {
  //     if ( this.team !== playerTeam ) return false;
  //     return (
  //       x >= this.x && x <= this.x + pieceSize &&
  //       y >= this.y && y <= this.y + pieceSize
  //     );
  //   }

  //   moveTo( { x, y }, fn ) {
  //     const dist = distance( {x: this.x + pieceSize / 2, y: this.y + pieceSize / 2}, { x, y } );
  //     if ( dist < this.range ) {
  //       this.x = x - pieceSize / 2;
  //       this.y = y - pieceSize / 2;
  //       board.render();
  //       fn();
  //     } else {
  //       fn( `Position is too far: ${dist}` );
  //     }
  //   }
  // }

  // let pieces;
  // let pieceToMove;

  // sandImg.onload = function () {
  //   context.drawImage(sandImg, 0, 0, 900, 600);

  //   pieces = [
  //     new Piece( 1, 'tank', 'green', {
  //       x: Math.floor( ( 900 - pieceSize ) * Math.random() ),
  //       y: Math.floor( ( 600 - pieceSize ) * Math.random() )
  //     } ),
  //     new Piece( 2, 'drone', 'green', {
  //       x: Math.floor( ( 900 - pieceSize ) * Math.random() ),
  //       y: Math.floor( ( 600 - pieceSize ) * Math.random() )
  //     } ),
  //     new Piece( 3, 'tank', 'red', {
  //       x: Math.floor( ( 900 - pieceSize ) * Math.random() ),
  //       y: Math.floor( ( 600 - pieceSize ) * Math.random() )
  //     } ),
  //     new Piece( 4, 'drone', 'red', {
  //       x: Math.floor( ( 900 - pieceSize ) * Math.random() ),
  //       y: Math.floor( ( 600 - pieceSize ) * Math.random() )
  //     } ),
  //   ];

  //   board.render();
  // };

  // class EventEmitter {
  //   constructor() {
  //     this.subscribers = {};
  //   }
  //   on( eventName, eventListener ) {
  //     if ( !this.subscribers[ eventName ] ) {
  //       this.subscribers[ eventName ] = [];
  //     }
  //     this.subscribers[ eventName ].push( eventListener );
  //   }
  //   emit( eventName ) {
  //     if ( !this.subscribers[ eventName ] ) return;

  //     const remainingArgs = [].slice.call( arguments, 1 );
  //     this.subscribers[ eventName ].forEach( function ( listener ) {
  //       listener.apply( null, remainingArgs );
  //     } );
  //   }
  // }

  // var board = new EventEmitter();

  // var shooting = false;
  // var currentMousePosition = { x: 0, y: 0 },
  //   lastMousePosition = { x: 0, y: 0 };

  // let drawStart = { x: 0, y: 0 };
  // let lastDistance = 0;
  // let shotStart, shotEnd;

  // canvas.addEventListener( 'mousedown', function ( ev ) {
  //   const mousePos = {
  //     x: ev.pageX - this.offsetLeft,
  //     y: ev.pageY - this.offsetTop
  //   };
  //   if ( action === 'shooting' ) {
  //     shotCanHit = true;
  //     pieces.forEach( pc => {
  //       if ( pc.mouseOn( mousePos ) ) {
  //         shooting = true;
  //       }
  //     } );
  //   }

  //   if ( action === 'moving' ) {
  //     moving = true;
  //     if ( !pieceToMove ) {
  //       pieces.forEach( pc => {
  //         if ( pc.mouseOn( mousePos ) ) {
  //           console.log( `Mouse is on me!`, pc );
  //           pieceToMove = pc;
  //           pieceToMove.showRange();
  //         }
  //       } );
  //     } else {
  //       pieceToMove.moveTo( mousePos, ( err ) => {
  //         if ( !err ) {
  //           pieceToMove = null;
  //         } else {
  //           console.error( err );
  //         }
  //       } );
  //     }
  //   }


  //   currentMousePosition = Object.assign( {}, mousePos );

  //   drawStart = Object.assign( {}, currentMousePosition );
  //   lastDistance = 0;
  //   // context.lineWidth = 5;
  //   shotStart = new Date();
  // } );

  function distance( _start, _end ) {
    return Math.sqrt( Math.pow( _end.x - _start.x, 2 ) + Math.pow( _end.y - _start.y, 2 ) );
  }

  // canvas.addEventListener( 'mouseup', function () {
  //   shooting = false;
  // } );

  // canvas.addEventListener( 'mousemove', function ( ev ) {
  //   const mousePos = {
  //     x: ev.pageX - this.offsetLeft,
  //     y: ev.pageY - this.offsetTop
  //   };

  //   if ( shooting ) {
  //     lastMousePosition = Object.assign( {}, currentMousePosition );
  //     currentMousePosition = mousePos;

  //     board.shoot( lastMousePosition, currentMousePosition, pieces );
  //   } else {
  //     // pieces.forEach( pc => {
  //     //   if ( distance( pc, mousePos ) < 30 ) {
  //     //     placeScope( pc );
  //     //   }
  //     // } );
  //   }
  // } );


  // function drawShot( shot ) {
  //   context.beginPath();
  //   context.strokeStyle = shot.strokeStyle;
  //   context.moveTo( shot.start.x, shot.start.y );
  //   context.lineTo( shot.end.x, shot.end.y );
  //   context.closePath();
  //   context.stroke();
  // }

  // board.shoot = function ( start, end, targets, shouldBroadcast ) {
  //   if ( action !== 'shooting' ) return;
  //   const dist = distance( drawStart, end );
  //   shotEnd = new Date();
  //   if ( dist > 250 || dist < lastDistance ) return;
  //   if ( shotEnd - shotStart > 150 ) return;
  //   lastDistance = dist;

  //   drawShot( { start, end, strokeStyle: `rgba(1, 1, 0, ${1 - (dist) / 250})` } );

  //   targets.forEach( trg => {
  //     if ( hit( trg ) ) {
  //       trg.isHit();
  //       board.render();
  //     }
  //   } );

  //   if ( shouldBroadcast ) {
  //     board.emit( 'shoot', start, end );
  //   }

  //   function hit( target ) {
  //     if ( start.x === end.x || start.y === end.y ) return false;
  //     const fn = ( x, y ) => ( end.y - start.y ) * x + ( start.x - end.x ) * y + ( end.x * start.y - start.x * end.y );
  //     let corners = [ fn( target.x, target.y ), fn( target.x + pieceSize, target.y ), fn( target.x, target.y + pieceSize ), fn( target.x + pieceSize, target.y + pieceSize ) ];
  //     if ( corners.filter( crn => crn === 0 ).length ) return true;
  //     if ( corners.filter( crn => crn > 0 ).length === 4 ) return false;
  //     if ( corners.filter( crn => crn < 0 ).length === 4 ) return false;

  //     return !(
  //       ( start.x > target.x + pieceSize && end.x > target.x + pieceSize ) || ( start.x < target.x && end.x < target.x ) ||
  //       ( start.y > target.y + pieceSize && end.y > target.y + pieceSize ) || ( start.y < target.y && end.y < target.y )
  //     );
  //   }
  // };

  // board.clear = function ( shouldBroadcast ) {
  //   context.clearRect( 0, 0, canvas.width, canvas.height );
  //   if ( shouldBroadcast ) board.emit( 'clear' );
  // };

  // board.render = function() {
  //   board.clear();
  //   context.save();
  //   context.globalAlpha = 0.6;
  //   context.drawImage(sandImg, 0, 0, 900, 600);
  //   context.restore();
  //   pieces.forEach(pc => pc.render());
  // };

})();
