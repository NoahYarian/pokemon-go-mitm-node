var pokes = require('./currentPokemonByIV');
var pokemonParsing = require('./pokemonParsing');
var showPokes = require('./showPokes');

var args = process.argv.slice(2);
// console.log(args);

// Usage?
// node app
// node app type Steel
processArgs(args);

function processArgs(args) {
  for (var i = 0; i < args; i++) {
    proccessArg(arg[i]);
  }
};

function processArg(arg) {

}

pokes = pokemonParsing.addTypesToPokes(pokes);

if (args[0] !== "type") { return console.log("uh"); }
var type = args[1];

var sorted = pokemonParsing.sortBy.moveset(pokes, "attack", type);

sorted = sorted.filter(function(pokie, i) {
  return pokie.type1 === type || pokie.type2 === type;
});

// showPokes.by(sort1, sort2, sort3);

for (var i = 0; i < sorted.length; i++) {
  if (type && type !== sorted[i].type1 && type !== sorted[i].type2) {
    console.log(type, sorted[i].type1, sorted[i].type2);
    continue;
  }
  console.log(pokemonParsing.makePokieInfoString(sorted[i], "attack", sorted[i].movesetAttackRank));
}

// rank current pokemon by moveset attack rating
// console.log(pokemonParsing.findPokieMovesetRank(pokes[pokes.length-1], "attack"));



// var movesetsByAtk = require('./movesetsByAtk');
// console.log(movesetsByAtk[0]);
