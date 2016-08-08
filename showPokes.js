var pokemonParsing = require('./pokemonParsing');
var utils = require('./utils');

module.exports = {
  byType: function(pokes, type) {
    var sorted = pokemonParsing.sortBy.moveset(pokes, "attack", type);

    sorted = sorted.filter(function(pokie, i) {
      return pokie.type1 === type || pokie.type2 === type;
    });

    for (var i = 0, infoString; i < sorted.length; i++) {
      if ( type
        && type !== sorted[i].type1
        && type !== sorted[i].type2) {
        continue;
      }
      infoString = pokemonParsing.makePokieInfoString(sorted[i], "attack", sorted[i].movesetAttackRank);
      if (i === 0) {
        console.log(`\n${utils.hr(infoString.length)}\n   |${type}\n`)
      }
      console.log(infoString);
    }
  }
}


//showPokes.by(sort1, sort2, sort3);
