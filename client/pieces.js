import state from './state';
import Piece from './Piece';
import player from './player';

const pieces = {

  _pieces: [],

  setPieces( piecesToSet ) {
    this._pieces = piecesToSet.map( pc => new Piece( pc.id, pc.type, pc.team, { x: pc.x, y: pc.y }, pc.health ) );
  },

  findById( id ) {
    let pc = this._pieces.filter( p => p.id === id )[ 0 ];
    if ( pc ) return pc;
    console.error( `There is no piece with id ${id}` );
  },

  addNewPiece( type, team, coords ) {
    if ( !coords ) {
      coords = {
        x: Math.floor( ( 900 - state.pieceSize ) * Math.random() ),
        y: Math.floor( ( 600 - state.pieceSize ) * Math.random() )
      };
    }
    let maxId = this._pieces.reduce( ( mx, pc ) => pc.id > mx ? pc.id : mx, 0 );
    this._pieces.push( new Piece( maxId + 1, type, team, coords ) );
  },

  clearTheDead() {
    this._pieces = this._pieces.filter( pc => pc.health );
  },

  renderAll() {
    this._pieces.forEach( pc => pc.render() );
  },

  getAll() {
    return this._pieces;
  },

  moveAllTo( idCoords ) {
    this._pieces = idCoords.map( js => new Piece( js.id, js.type, js.team, { x: js.x, y: js.y }, js.health ) );
  },

  checkSurvivors() {
    return this._pieces.filter( pc => pc.team === player.getTeam() ).length;
  }

};

export default pieces;

