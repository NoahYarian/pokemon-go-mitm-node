###
  Pokemon Go(c) MITM node proxy
  by Michael Strassburger <codepoet@cpan.org>

  Get and parse pokemon stats
###

PokemonGoMITM = require './lib/pokemon-go-mitm'
changeCase = require 'change-case'
freshSesh = true

server = new PokemonGoMITM port: 8081
  .addRequestHandler "GetInventory", (data) ->
    if data.inventory_delta and freshSesh
      freshSesh = false
      pokes = []
      for item in data.inventory_delta.inventory_items
        if item.inventory_item_data? and
           item.inventory_item_data.pokemon_data?
          pokemon = item.inventory_item_data.pokemon_data
          poke = {}
          poke.id = changeCase.titleCase pokemon.pokemon_id
          poke.name = pokemon.nickname ? poke.id.replace(" Male", "♂").replace(" Female", "♀")
          poke.move1 = pokemon.move_1 ? ""
          poke.move2 = pokemon.move_2 ? ""
          poke.hp = pokemon.stamina_max
          poke.cp = pokemon.cp
          poke.att = pokemon.individual_attack ? 0
          poke.def = pokemon.individual_defense ? 0
          poke.sta = pokemon.individual_stamina ? 0
          poke.iv = Math.round (poke.att + poke.def + poke.sta) * 100/45
          unless poke.att is 0 and
                 poke.def is 0 and
                 poke.sta is 0
            pokes.push poke
      console.log JSON.stringify pokes, null, 4
    # Always get the full inventory
    data.last_timestamp_ms = 0
    data
