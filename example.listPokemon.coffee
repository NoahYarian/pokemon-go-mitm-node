###
  Pokemon Go(c) MITM node proxy
  by Michael Strassburger <codepoet@cpan.org>

  Example by Noah Yarian <noah.yarian.gmail.com>

  See how your pokemon stack up
###

PokemonGoMITM = require './lib/pokemon-go-mitm'
changeCase = require 'change-case'
hasMadeRequest = false

server = new PokemonGoMITM port: 8081
  .addRequestHandler "GetInventory", (data) ->
    if hasMadeRequest then return
    # We set the timestamp for some time in the first week of play. This seems like a value to be careful with,
    # because though the api returns responses for values outside the range of what makes sense for the client
    # to send, we don't know what logging is going on. For me the whole point of this kind of a solution is to
    # only observe, and to not modify.

    randomIntFromInterval = (min, max) ->
      Math.floor Math.random()*(max-min+1)+min

    minMs = new Date("June 17, 2016").getTime()
    maxMs = new Date("June 24, 2016").getTime()
    data.last_timestamp_ms = randomIntFromInterval minMs, maxMs
    console.log "req timestamp: " + data.last_timestamp_ms
    # reqs for the first week of play might also be weird. Should use a DB. Another idea:
    # Date.now() - 90*24*60*60*1000;   #90 days ago
    hasMadeRequest = true
    data

  .addResponseHandler "GetInventory", (data) ->
    console.log 'resp'
    if data.inventory_delta
      pokes = []
      for item in data.inventory_delta.inventory_items
        if item.inventory_item_data? and
           item.inventory_item_data.pokemon_data? and
           item.inventory_item.data.pokemon_data.pokemon_id? # excludes eggs

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
    data
