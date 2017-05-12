window.player = {
  team: null,
  getTeam() {
    return this.team;
  },
  setTeam( team ) {
    if ( !this.team ) {
      this.team = team;
      console.log( this.team );
      return this.team;
    } else {
      console.error( `Team is already set to ${this.team}` );
    }
  }
};

export default player;

