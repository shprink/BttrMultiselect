class BttrMultiselectParser
		constructor: (select) ->
				@totalNode = 0
				@hasGroup = false
				@parsed = []
				@addNode( child, index) for child, index in select.childNodes
				return this				

		addNode: (child, index) ->
				if child.nodeName.toUpperCase() is "OPTGROUP"
						this.addGroup child, index
				else
						this.addOption child, index

		addGroup: (group, index) ->
				@hasGroup = true
				array_index = @parsed.length
				g = 
						group: true
						index: index
						text: group.label
						disabled: group.disabled
						children: []
				@parsed.push g

				this.addOption option, index,  array_index, g.index, g.disabled for option, index in group.childNodes
		
		addOption: (option, index, array_index, group_index, group_disabled) ->
				if option.nodeName.toUpperCase() is "OPTION"
						o =
								index : index
						if group_index
								o.groupindex = group_index
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
					