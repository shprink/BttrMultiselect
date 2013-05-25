class BttrMultiselectParser
		constructor: (select) ->
				@index = 0
				@hasGroup = false
				@parsed = []
				@addNode( child ) for child in select.childNodes
				return this				

		addNode: (child) ->
				if child.nodeName.toUpperCase() is "OPTGROUP"
						this.addGroup child
				else
						this.addOption child

		addGroup: (group) ->
				@hasGroup = true
				array_index = @parsed.length
				g = 
						group: true
						index: @index
						text: group.label
						disabled: group.disabled
						children: []
				@parsed.push g
				@index += 1

				this.addOption option, array_index, g.index, g.disabled for option in group.childNodes
		
		addOption: (option, array_index, group_index, group_disabled) ->
				if option.nodeName.toUpperCase() is "OPTION"
						o =
								index: @index
						if option.text != ""
								o.text = option.text
								o.selected = option.selected
								o.disabled = if group_disabled is true then group_disabled else option.disabled
						else
								o.empty = true
						# Adding one option
						if array_index
								@parsed[array_index].children.push o
						else
								@parsed.push o
						@index += 1