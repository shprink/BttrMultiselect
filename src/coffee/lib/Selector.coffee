class Selector
	constructor: (@element, data, @multiple) ->
		@element.html this.parse data
		
	parse: (data)->
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
		classes = []
		classes.push "bttr-group"
		classes.push "bttr-group-disabled" if group.disabled

		"""
		<li data-index="#{ group.array_index }" class="#{ classes.join(' ') }">
			<div>#{ group.label }<span>#{ group.children }</span></div>
		</li>
		"""

	addOption: (option) ->
		option.dom_id = @container_id + "_o_" + option.array_index

		classes = []
		classes.push "bttr-option"
		classes.push "bttr-option-disabled" if option.disabled
		classes.push "bttr-option-selected" if option.selected

		"""
		<li data-index="#{ option.array_index }" class="#{ classes.join(' ') }">
			<div>#{ option.html }</div>
		</li>
		"""