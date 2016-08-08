var myRawPokes = require('./currentPokemonByIV');
var pokemonParsing = require('./pokemonParsing');
var showPokes = require('./showPokes');

//////////////////////////
//// Usage: //////////////
//                      //
// node app             //
// node app type Steel  //
// node app type [all]  //
//                      //
//////////////////////////

var pokes = evolvePokes(myRawPokes);
processArgs();

function evolvePokes(rawPokes) {
  var typedPokes = pokemonParsing.addTypesToPokes(rawPokes);
  var rankedAndTypedPokes = pokemonParsing.addMovesetRankToPokes(typedPokes, "attack");
  return rankedAndTypedPokes;
}

function processArgs(args) {
  var args = process.argv.slice(2);

  if (args[0] === "type") {
    processTypeArgs(args);
  }
}

function processTypeArgs(args) {
  var type = args[1] || "all";

  if (type === "all") {
    for (var i = 0; i < pokemonParsing.pokemonTypes.length; i++) {
      showPokes.byType(pokes, pokemonParsing.pokemonTypes[i]);
    }
  } else {
    showPokes.byType(pokes, type);
  }
}
