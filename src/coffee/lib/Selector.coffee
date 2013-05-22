class Selector
	constructor: (@element, data, @multiple) ->
		@element.html this.parse data
		
	parse: (data)->
		console.log data.length;
		content = ''
		i = 0
		for node in data
			if node.group
				i++
				content += @addGroup node
			else if !node.empty
				content += @addOption node
		return content

	addGroup: (group) ->
		if not group.disabled
      group.dom_id = @container_id + "_g_" + group.array_index
      '<li id="' + group.dom_id + '" class="group-result">' + $("<div />").text(group.label).html() + '</li>'
    else
      ""
	addOption: (option) ->
		if not option.disabled
      option.dom_id = @container_id + "_o_" + option.array_index

      classes = if option.selected and @is_multiple then [] else ["active-result"]
      classes.push "result-selected" if option.selected
      classes.push "group-option" if option.group_array_index?
      classes.push option.classes if option.classes != ""

      style = if option.style.cssText != "" then " style=\"#{option.style}\"" else ""

      '<li id="' + option.dom_id + '" class="' + classes.join(' ') + '"'+style+'>' + option.html + '</li>'
    else
      ""		