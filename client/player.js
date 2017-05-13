window.player = {
  team: null,
  getTeam() {
    return this.team;
  },
  setTeam( team ) {
    if ( !this.team ) {
      this.team = team;
      const footer = document.getElementById('footer');
      footer.innerText = `${team.charAt(0).toUpperCase() + team.slice(1)} Team`;
      footer.style.color = team;
      footer.style.fontWeight = 'bold';
      return this.team;
    } else {
      console.error( `Team is already set to ${this.team}` );
    }
  }
};

export default window.player;

