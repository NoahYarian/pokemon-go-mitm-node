var movesetsByAtk = require('./movesetsByAtk');

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

      var sorted = pokesWithRank.sort(function(a, b) {
        if (a[propName] > b[propName]) {
          return -1;
        } else if (a[propName] < b[propName]) {
          return 1;
        }
        return 0;
      });
      for (var i = 0; i < sorted.length; i++) {
        console.log(api.makePokieInfoString(sorted[i], rankType, sorted[i][propName]));
      }
      return sorted;
    }
  },
  makePokieInfoString: function(pokie, rankType, rank) {
    // msg = pokie.cp + "CP " + pokie.id + " with " + basicAttack + " and "
    // + chargeAttack + " has moveset " + rankType + " ranking of " + rank;
    var basicAttack = api.parseAttackName(pokie.move1);
    var chargeAttack = api.parseAttackName(pokie.move2);
    // return `${pokie.cp}CP ${pokie.id} with ${basicAttack} and ` +
    //   `${chargeAttack} has moveset ${rankType} ranking of ${rank}`;
    // return `{ #${rank} ${rankType} }:[${pokie.id}, ${basicAttack}, ${chargeAttack}]:{ ${pokie.name}` +
    //        ` ${pokie.iv}% ${pokie.cp} CP | ATT: ${pokie.att} DEF: ${pokie.def} STA: ${pokie.sta} }`
    return ` #${api.padTrim(rank, 4)} ${api.padTrim(pokie.id, 11)} ${api.padTrim(pokie.iv, 2)}% ${api.padTrim(pokie.cp + "CP", 6)}` +
      ` ${api.padTrim(basicAttack, 13)} ${api.padTrim(chargeAttack, 13)} ${api.padTrim(pokie.name, 11)}` +
      ` | ATT: ${api.padTrim(pokie.att, 2)} DEF: ${api.padTrim(pokie.def, 2)} STA: ${api.padTrim(pokie.sta, 2)} |`;
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
  findPokieMovesetRank: function(pokie, rankType) {
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
    return rankedPokes;
  }
};

module.exports = api;
