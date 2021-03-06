###
  Pokemon Go(c) MITM node proxy
  by Michael Strassburger <codepoet@cpan.org>

  Get and parse pokemon stats
###

PokemonGoMITM = require './lib/pokemon-go-mitm'
changeCase = require 'change-case'

server = new PokemonGoMITM port: 8081
  .addRequestHandler "GetInventory", (data) ->
    # We set the timestamp for some time in the first week of play. This seems like a value to be careful with,
    # as the api returns responses for values outside the range of what makes sense for the client to send.
    #
    # I think a clear solution here is to move to using a database
    #
    randomIntFromInterval (min,max) ->
      Math.floor Math.random()*(max-min+1)+min
    min = new Date("July 7, 2016").getTime()
    max = new Date("July 14, 2016").getTime()
    data.last_timestamp_ms = randomIntFromInterval min, max
    console.log "req timestamp: " + data.last_timestamp_ms
    # data.last_timestamp_ms =
    #  Date.now() - 90*24*60*60*1000; #90 days ago
    data

  .addResponseHandler "GetInventory", (data) ->
    console.log 'resp'
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
    data
