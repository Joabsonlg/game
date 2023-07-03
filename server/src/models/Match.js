class Match {
    constructor(creator) {
      this.creator = creator;
      this.status = "created";
      this.players = [creator];
    }
  }
  
  module.exports = Match;