class BttrMultiselect extends AbstractBttr
		
	formatGroup: (group) ->
		classes = []
		classes.push "bttr-group"
		classes.push "bttr-group-disabled" if group.disabled

		$group = $("""
		<li data-groupindex="#{ group.index }" class="#{ classes.join(' ') }">
			<div class="bttr-group-label">
				<i class="icon-folder-close-alt"></i> #{ group.text }
				<span>#{ group.children.length }</span>
			</div>
			<ul class="bttr-options" style="display:none"></ul>
		</li>
		""")

		# Adding the checkbox input if the group is not disabled
		if !group.disabled
			$group.find('.bttr-group-label').append $('<input type="checkbox">')
			
		$group.find('input').click (event)=>
			event.stopPropagation()
			@$bttrSelect.trigger('onBeforeGroupSelection', [$group, $(event.currentTarget), self])						

			# Add Node to the wish list
			@_registerNode $group, group

			# Remove node
			@$bttrSelect.trigger('onGroupSelection', [$group, $(event.currentTarget), self])						

			# trigger the select change event
			@$select.trigger('change', [event]);

		return $group