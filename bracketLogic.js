function generateDoubleElimBracket(players) {
  const rounds = Math.log2(players.length);
  const upper = [];
  let matchId = 1;

  for (let r = 0; r < rounds; r++) {
    const round = [];
    const numMatches = players.length / Math.pow(2, r + 1);
    for (let i = 0; i < numMatches; i++) {
      round.push({ id: matchId++, p1: null, p2: null, winner: null });
    }
    upper.push(round);
  }

  for (let i = 0; i < players.length / 2; i++) {
    upper[0][i].p1 = players[i * 2];
    upper[0][i].p2 = players[i * 2 + 1];
  }

  return {
    players,
    upper,
    lower: [],
    finals: null
  };
}

module.exports = { generateDoubleElimBracket };