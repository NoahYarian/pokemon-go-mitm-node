var movesetsByAtk = require('./movesetsByAtk');

var api = {

  // to parse    "move1": "BUBBLE_FAST",
  //             "move2": "FLASH_CANNON",
  //
  // into        "move1": "Bubble",
  //             "move2": "Flash Cannon",
  parseAttackName: function (attackStr) {
    var words = attackStr.split("_");
    var attackWords = [];
    for (var i = 0, word; i < words.length; i++) {
      word = words[i];
      if (word === "FAST") { break; }
      attackWords.push(api.capitalizeFirstLetter(word));
    }
    return attackWords.join(' ');
  },

  capitalizeFirstLetter: function (string) {
    return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
  },

  groupPokemon: function (pokes) {
    var groupedPokies = {};
    for (var i = 0, poke, id; i < pokes.length; i++) {
      poke = pokes[i];
      id = poke.id;
      if (groupedPokies[id]) {
        groupedPokies[id].push(poke);
      } else {
        groupedPokies[id] = [poke];
      }
    }
    return groupedPokies;
  },

  getMostPerfectPokemon: function (groupedPokies) {
    var highIVs = {};

    for (var id in pokes) {
      var pokesGroup = pokes[id];
      for (var i = 0; i < pokesGroup.length; i++) {
        if (highIVs[id] && highIVs[id].iv) {
          if (pokesGroup[i].iv > highIVs[id].iv) {
            highIVs[id] = pokesGroup[i];
          }
        } else {
          highIVs[id] = pokesGroup[i];
        }
      }
      console.log(id + " - " + pokesGroup.length + " - best is " + highIVs[id].iv + "% perfect");
    }
    return highIVs;
  },

  // pokes.sort(api.sortBy.iv)
  sortBy: {
    iv: function(pokes) {
      return pokes.sort(function(a, b) {
        if (a.iv > b.iv) {
          return -1;
        } else if (a.iv < b.iv) {
          return 1;
        }
        return 0;
      });
    },
    name: function(pokes) {
      return pokes.sort(function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    },
    moveset: function(pokes, rankType) {
      var rankedArr = [];
      var propName = "moveset" + api.capitalizeFirstLetter(rankType) + "Rank";
      var pokesWithRank = api.addMovesetRankToPokes(pokes, rankType);

      return pokesWithRank.sort(function(a, b) {
        if (a[propName] > b[propName]) {
          return -1;
        } else if (a[propName] < b[propName]) {
          return 1;
        }
        return 0;
      });
    }
  },
  findPokieMovesetRank: function(pokie, rankType) {
    if (rankType !== "attack") { return; } // not implmenting yet

    var basicAttack = api.parseAttackName(pokie.move1);
    var chargeAttack = api.parseAttackName(pokie.move2);
    console.log(basicAttack, "\n", chargeAttack);
    for (var i = 0; i < movesetsByAtk.length; i++) {
      if ( movesetsByAtk[i]["Basic Atk"] === basicAttack
        && movesetsByAtk[i]["Charge Atk"] === chargeAttack ) {
        console.log("Dis", movesetsByAtk[i]);
        console.log(pokie.cp + "CP " + pokie.id + " with " + basicAttack + " and "
                    + chargeAttack + " has moveset " + rankType + " ranking of " + (i + 1));
        return i + 1;
      }
    }
  },
  addMovesetRankToPokie: function(pokie, rankType) {
    if (rankType !== "attack") { return; } // not implmenting yet

    var rank = api.findPokieMovesetRank(pokie, rankType);
    var propName = "moveset" + api.capitalizeFirstLetter(rankType) + "Rank";
    pokie[propName] = rank;
    return pokie;
  },
  addMovesetRankToPokes: function(pokes, rankType) {
    var start = Date.now();
    var rankedPokes = [];
    for (var i = 0; i < pokes.length; i++) {
      rankedPokes[i] = api.addMovesetRankToPokie(pokes[i], rankType);
    }
    var elapsedMs = Date.now() - start;
    console.log("Took " + elapsedMs + "ms");
    console.log(movesetsByAtk);
    return rankedPokes;
  }
};

module.exports = api;
