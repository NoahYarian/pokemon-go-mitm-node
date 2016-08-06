var pokes = require('./currentPokemonByIV');
var pokemonParsing = require('./pokemonParsing');

// rank current pokemon by moveset attack rating
console.log(pokemonParsing.findPokieMovesetRank(pokes[pokes.length-1], "attack"));

// console.log(pokemonParsing.sortBy.moveset(pokes, "attack"));

// var movesetsByAtk = require('./movesetsByAtk');
// console.log(movesetsByAtk[0]);
