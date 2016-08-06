module.exports = {

  // parse THIS_DUMB_SHIT to This Dumb Shit
  calm: function (intensity) {
    var calm = [];
    var words = intensity.split("_");
    for (var i = 0, word, letters; i < words.length; i++) {
      word = words[i];
      calm.push(this.capitalizeFirstLetter(word));
    }
    var peace = calm.join(' ');
    return peace;
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

  // pokes.sort(this.sortBy.iv.ascending)
  sortBy: {
    iv: {
      descending: function(a, b) {
        if (a.iv > b.iv) {
          return -1;
        } else if (a.iv < b.iv) {
          return 1;
        }
        return 0;
      },
      ascending: function(a, b) {
        if (a.iv > b.iv) {
          return 1;
        } else if (a.iv < b.iv) {
          return -1;
        }
        return 0;
      }
    },
    name: {
      abc: function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      },
      zyx: function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      }
    },
    type: {}
  }
};
