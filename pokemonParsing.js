// parse THIS_DUMB_SHIT to This Dumb Shit

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}

function calm (intensity) {
  var calm = [];
  var words = intensity.split("_");
  for (var i = 0, word, letters; i < words.length; i++) {
    word = words[i];
    calm.push(capitalizeFirstLetter(word));
  }
  let peace = calm.join(' ');
  return peace;
}


{
  id: 'Dratini',
  name: 'Dratini',
  move1: 'DRAGON_BREATH_FAST',
  move2: 'AQUA_TAIL',
  hp: 46,
  cp: 362,
  att: 15,
  def: 13,
  sta: 15,
  iv: 96
}

var x = [pokies];

function groupPokemon (pokes) {
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
}

function getMostPerfectPokemon (groupedPokies) {
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
}