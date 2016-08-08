var movesetsByAtk = require('./movesetsByAtk');
var pokedex = require('./pokedecks');


var api = {

  // to parse    "move1": "BUBBLE_FAST",
  //             "move2": "FLASH_CANNON",
  //
  // into        "move1": "Bubble",
  //             "move2": "Flash Cannon",
  parseAttackName: function (attackStr) {
    if (attackStr === "X_SCISSOR") { return "X-Scissor"; }
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
    var groupedPokes = {};
    for (var i = 0, pokie, id; i < pokes.length; i++) {
      pokie = pokes[i];
      id = pokie.id;
      if (groupedPokes[id]) {
        groupedPokes[id].push(pokie);
      } else {
        groupedPokes[id] = [pokie];
      }
    }
    return groupedPokes;
  },

  getMostPerfectPokemon: function (groupedPokes) {
    var highIVs = {};

    for (var id in groupedPokes) {
      var pokesGroup = groupedPokes[id];
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
      var propName = api.getMovesetRankTypePropName(rankType);
      var pokesWithRank = api.addMovesetRankToPokes(pokes, rankType);

      var sorted = pokesWithRank.sort(function(a, b) {
        if (a[propName] > b[propName]) {
          return -1;
        } else if (a[propName] < b[propName]) {
          return 1;
        }
        return 0;
      });
      return sorted;
    }
  },
  makePokieInfoString: function(pokie, rankType, rank) {
    // msg = pokie.cp + "CP " + pokie.id + " with " + basicAttack + " and "
    // + chargeAttack + " has moveset " + rankType + " ranking of " + rank;
    var basicAttack = api.parseAttackName(pokie.move1);
    var chargeAttack = api.parseAttackName(pokie.move2);
    return ``+
      ` #${api.padTrim(rank, 4, "right")}`+
      ` ${api.padTrim(pokie.id, 11)}`+
      ` ${api.padTrim(pokie.iv, 2, "right")}%`+
      ` ${api.padTrim(pokie.cp + "CP", 6, "right")}`+
      ` ${api.padTrim(pokie.type1, 8)}`+
      ` ${api.padTrim(pokie.type2, 8)}`+
      ` ${api.padTrim(basicAttack, 13)}`+
      ` ${api.padTrim(chargeAttack, 13)}`+
      ` ${api.padTrim(pokie.name, 11)}`+
      ` | ATT: ${api.padTrim(pokie.att, 2, "right")}`+
      ` DEF: ${api.padTrim(pokie.def, 2, "right")}`+
      ` STA: ${api.padTrim(pokie.sta, 2, "right")} |`;
      //TODO: would like to say how many candies I have and evolution stuff with stardust and time, etc, etc.
  },
  padTrim: function(str, len, align) {
    // when called with len = 10
      // should change "" into "          "
      // should change "bacon" into "bacon     "
      // should change "SOOPERDOOPER" into "SOOPERDOOP"
      // shouldn't change "fantarctic"
    str = str || "";
    str = String(str);
    len = len || 0;
    align = align || "left";

    if (align === "left") {
      if (str.length > len) {
        var arr = str.split('');
        arr.length = len;
        str = arr.join('');
      }
      for (var i = str.length; i < len; i++) {
        str += " ";
      }
    } else if (align === "right") {
      var arr = str.split('');
      while (arr.length > len) {
        arr.shift();
      }
      while(arr.length < len) {
        arr.unshift(" ")
      }
      str = arr.join('');
    }
    return str;
  },
  getPokieMovesetRank: function(pokie, rankType) {
    if (rankType !== "attack") { return; } // not implemented yet
    var basicAttack = api.parseAttackName(pokie.move1);
    var chargeAttack = api.parseAttackName(pokie.move2);
    for (var i = 0; i < movesetsByAtk.length; i++) {
      if ( movesetsByAtk[i]["Name"] === pokie.id
        && movesetsByAtk[i]["Basic Atk"] === basicAttack
        && movesetsByAtk[i]["Charge Atk"] === chargeAttack ) {
        var rank = i + 1;
        return rank;
      }
    }
  },
  addMovesetRankToPokie: function(pokie, rankType) {
    if (rankType !== "attack") { return; } // not implemented yet

    var rank = api.getPokieMovesetRank(pokie, rankType);
    var propName = api.getMovesetRankTypePropName(rankType)
    pokie[propName] = rank;
    return pokie;
  },
  addMovesetRankToPokes: function(pokes, rankType) {
    var rankedPokes = [];
    for (var i = 0; i < pokes.length; i++) {
      rankedPokes[i] = api.addMovesetRankToPokie(pokes[i], rankType);
    }
    return rankedPokes;
  },
  getMovesetRankTypePropName: function(rankType) {
    return "moveset" + api.capitalizeFirstLetter(rankType) + "Rank"
  },
  getPokieTypes: function(pokie) {
    for (var i = 0; i < pokedex.length; i++) {
      if (pokedex[i].name === pokie.id) {
        return pokedex[i].types
      }
    }
  },
  addTypesToPokie: function(pokie) {
    var types = api.getPokieTypes(pokie);
    pokie.type1 = types[0];
    pokie.type2 = types[1] || null;
    return pokie;
  },
  addTypesToPokes: function(pokes) {
    var typedPokes = pokes;
    for (var i = 0; i < pokes.length; i++) {
      typedPokes[i] = api.addTypesToPokie(pokes[i]);
    }
    return typedPokes;
  },
  pokemonTypes: [
    "Normal",
    "Fire",
    "Fighting",
    "Water",
    "Flying",
    "Grass",
    "Poison",
    "Electric",
    "Ground",
    "Psychic",
    "Rock",
    "Ice",
    "Bug",
    "Dragon",
    "Ghost",
    "Dark",
    "Steel",
    "Fairy"
  ]
};

module.exports = api;
