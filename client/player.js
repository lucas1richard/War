const player = (function () {
  let team = null;
  return {
    getTeam() {
      return team;
    },
    setTeam(_team) {
      if (!team) {
        team = _team;
        const footer = document.getElementById('footer');
        footer.innerText = `${team.charAt(0).toUpperCase() + team.slice(1)} Team`;
        footer.style.color = team;
        footer.style.fontWeight = 'bold';
        return this.team;
      } else {
        console.error(`Team is already set to ${this.team}`);
      }
    }
  };
})();

export default player;

