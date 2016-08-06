var bestMoveSets = require('./bestMovesetsSimple');
var pokes = require('./currentPokemonByIV');
var pokemonParsing = require('./pokemonParsing');
// Workspace!

(function pokeCheck() {
  if (bestMoveSets && pokes && pokemonParsing) {
    console.log("Ok!");
  } else {
    console.log("Bew!");
  }
})();
