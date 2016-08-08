var pokemonParsing = require('./pokemonParsing');
var utils = require('./utils');

module.exports = {
  byType: function(pokes, type) {
    var sorted = pokemonParsing.sortBy.moveset(pokes, "attack", type);

    sorted = sorted.filter(function(pokie, i) {
      return pokie.type1 === type || pokie.type2 === type;
    });

    for (var i = 0; i < sorted.length; i++) {
      if ( type
        && type !== sorted[i].type1
        && type !== sorted[i].type2) {
        continue;
      }
      if (i === 0) {
        console.log(`\n${utils.hr(115)}\n   |${type}\n`)
      }
      console.log(pokemonParsing.makePokieInfoString(sorted[i], "attack", sorted[i].movesetAttackRank));
    }
  }
}


//showPokes.by(sort1, sort2, sort3);
