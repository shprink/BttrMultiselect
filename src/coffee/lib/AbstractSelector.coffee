class AbstractSelector
	constructor: (@element, data) ->
		@element.html this.parse data

	addGroup: (group) ->
		if not group.disabled
      group.dom_id = @container_id + "_g_" + group.array_index
      '<li id="' + group.dom_id + '" class="group-result">' + $("<div />").text(group.label).html() + '</li>'
    else
      ""