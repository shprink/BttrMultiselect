class SelectorGroup extends AbstractSelector

	parse: (data)->
		content = ''
		for node in data
			if node.group			
				content += this.addGroup node
		return content