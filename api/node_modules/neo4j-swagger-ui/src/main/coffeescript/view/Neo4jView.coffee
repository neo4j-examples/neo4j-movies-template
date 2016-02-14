class Neo4jView extends Backbone.View
  events: {
    'click .cyphers_list li'  : 'switchCypher'
  }

  initialize: ->

  render: ->
    template = @template()

    $(@el).html(template)

    @addCyphers()

    @

  template: ->
    Handlebars.templates.neo4j_query

  displayNone: ->
    return if @numCyphers then ' style="display:none"' else ''

  addCypherNumber: ->
    $(".cyphers_list", $(@el)).append "<li>#{@numCyphers+1}</li>"

  addCypher: (cypher) ->
    # log cypher
    if cypher.query
      @addCypherNumber()

      $(".response_neo4j_query", $(@el)).append "<pre id='query_#{@numCyphers}'#{@displayNone()}>#{cypher.query.replace(/\n/g, '<br>')}</pre>"

      code = $('<code />').text(JSON.stringify(cypher.params, null, 2))
      pre = $("<pre class='json' id='params_#{@numCyphers}'#{@displayNone()}/>").append code
      $(".response_neo4j_params", $(@el)).append pre

      code = $('<code />').text(JSON.stringify(cypher.results, null, 2))
      pre = $("<pre class='json' id='results_#{@numCyphers}'#{@displayNone()}/>").append code
      $(".response_neo4j_results", $(@el)).append pre

      @numCyphers++
    else
      @addCypher c for c in cypher

  addCyphers: ->
    @numCyphers = 0
    @addCypher @model
    hljs.highlightBlock($('.response_neo4j_params', $(@el))[0])
    hljs.highlightBlock($('.response_neo4j_results', $(@el))[0])

  showQuery: (e) ->
    e?.preventDefault()


  # handler for switching cyphers
  switchCypher: (e) ->
    e?.preventDefault()
    $("pre", $(@el)).hide()
    $(".cyphers_list li", $(@el)).removeClass('selected')
    # log(e)
    e?.currentTarget.className+='selected'
    id = parseInt(e?.currentTarget.textContent) - 1
    # log id
    @showCypher id

  # handler for show cypher by id
  showCypher: (id) ->
    $("#query_"+id, $(@el)).show()
    $("#params_"+id, $(@el)).show()
    $("#results_"+id, $(@el)).show()

