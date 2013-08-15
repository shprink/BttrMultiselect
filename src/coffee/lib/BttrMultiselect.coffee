class BttrMultiselect extends AbstractBttr

	_injectGroup: (groupIndex, group) ->
		classes = []
		classes.push "bttr-group"
		classes.push "bttr-group-disabled" if group.disabled

		$group = $("""
		<li data-groupindex="#{ groupIndex }" class="#{ classes.join(' ') }">
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

		self = this
		$group.find('input').click (event)->
			event.stopPropagation()
			self.$bttrSelect.trigger('onBeforeGroupSelection', [$group, $(this), self])						

			# Add Node to the wish list
			self._registerNode $(this), group

			# Remove node
			self.$bttrSelect.trigger('onGroupSelection', [$group, $(this), self])						

			# trigger the select change event
			self.$select.trigger('change', [event]);

		$group.find('.bttr-group-label').click (event)->
			icon = $(this).find('i')
			# Then doing the same for each children
			if !$(this).hasClass 'optionsLoaded'
				# Adding a loading class
				icon.removeClass 'icon-folder-close-alt'
				icon.addClass 'icon-spinner icon-spin'
				self._injectOption index, option, groupIndex, $group for option, index in group.children
				# Removing the loading class
				icon.removeClass 'icon-spinner icon-spin'
				icon.addClass 'icon-folder-close-alt'
				$(this).addClass 'optionsLoaded'

			$group.find('ul.bttr-options').toggle 100, ()=>
				if icon.hasClass 'icon-folder-close-alt'
					icon.removeClass 'icon-folder-close-alt'
					icon.addClass 'icon-folder-open-alt'
				else
					icon.removeClass 'icon-folder-open-alt'
					icon.addClass 'icon-folder-close-alt'
				# Scroll to the group
				self.$list.animate({
					scrollTop: $(this).offset().top + (self.$list.scrollTop()- self.$list.offset().top)
				}, 50);

		# inject the group to the DOM
		@$list.append $group