class AbstractBttr

	constructor: (@select, @options = {}) ->
		@$select = $(@select)
		# Set options
		$.extend @options, @_getDefaultOptions(), @options

		# We create our elements
		@$bttrSelect = $(@_getTemplate())
		@$button = @$bttrSelect.find('a.bttrmultiselect-button')
		@$search = @$bttrSelect.find('div.bttrmultiselect-search input')
		@$list = @$bttrSelect.find('ul.bttrmultiselect-list')
		@$selectedList = @$bttrSelect.find('ul.bttrmultiselect-selected-list')

		# Insert BttrMultiselect
		@$bttrSelect.insertAfter(@$select);

		# Set the size
		@width = @$select.outerWidth()

		@disable() if @$select.is(':disabled')
		@$select.hide()

		# Set position 
		@_setButtonWidth();
		@_setContentWidth();
		@_setContentPosition();

		# Make sure we instanciate once per element
		@$select.addClass "bttrmultiselect-done"

		# close the content
		@opened = false

		# initiate node container
		@selected = []

		# Parse Select
		if (@options.parse is 'onInstantiating')
			@_parse()

		@_bindEvents()
		@_setupListeners()

		return this
		
	###
	Private Functions
	###

	_getDefaultOptions: () ->
		options = 
			search :
				enabled: true
				opened: false
			parse : 'onOpening', # || onInstantiating
			nodeMax : 50

	_getTemplate: () ->
		"""<div class='bttrmultiselect'>
			<div class='bttrmultiselect-inner'>
				<a href="javascript:void(0)" class='bttrmultiselect-button'>
					<span class="bttrmultiselect-selected"></span>
					<b></b>
				</a>
				<div class='bttrmultiselect-content'>
					<div class='bttrmultiselect-search'>
						<input type="text" />
					</div>
					<ul class='bttrmultiselect-list'></ul>
					<ul class='bttrmultiselect-selected-list'></ul>
				</div>
			</div>
		</div>
		"""

	_bindEvents: () ->
		@$button.on 'click', (event) =>
			if @opened
				@close()
			else
				@open()

		# Focus after CSS transition
		@$bttrSelect.bind "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", (event) =>
			if @opened
				@$search.focus()
			else
				@$search.blur()
				@_resetSearch()

	_setupListeners: () ->
		# BttrSelect events
		@$bttrSelect.bind 'onGroupSelection', (evt, $group, $checkbox) =>
			#if $checkbox.is(':checked')
				#$group.remove();

		@$bttrSelect.bind 'onOptionSelection', (evt, $option) =>
			#$option.remove();

		@$bttrSelect.bind 'onSelectedUpdate', (evt, selected, node) =>
			console.log selected.length, 'selected.length'
			@$button.find('.bttrmultiselect-selected').text(selected.length)

		# Select events
		@$select.bind 'refreshed', (evt) => @refresh(evt); return

	_setButtonWidth: () ->
		@$button.css('width', @width);

	_setContentWidth: () ->
		@$bttrSelect.css('width', @width);

	_setContentPosition: () ->
		pos = @$button.offset();
		@$bttrSelect.css
			'top': pos.top,
			'left': pos.left

	_resetSearch: () ->
		@$search.val ''

	_testGlobalClick: (event) =>
		if not @$bttrSelect.find(event.target).length
			@close()

	_injectNodes: () ->
		# first we empty the list (just in case)
		@$list.empty()
		# Then we iterate through our node data
		for node, index in @data.parsed
			if node.group
				# No need to display empty groups
				if node.children.length > 0
					@_injectGroup index, node
			else if !node.empty
				@_injectOption index, node

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

	_injectOption: (index, option, groupIndex, $group) ->
		classes = []
		classes.push "bttr-option"
		classes.push "bttr-option-disabled" if option.disabled
		classes.push "bttr-option-selected" if option.selected

		$option = $("""
		<li data-groupindex="#{ groupIndex }" data-optionindex="#{ index }" class="#{ classes.join(' ') }">
			<div>#{ option.text }</div>
		</li>
		""")

		if option.groupindex
			$option.attr('data-groupindex', option.groupindex)

		self = this
		$option.click (event)->
			self.$bttrSelect.trigger('onBeforeOptionSelection', [$(this), self])						

			# Add Node to the wish list
			self._registerNode $(this), option

			# Remove node
			self.$bttrSelect.trigger('onOptionSelection', [$(this), self])						

			# trigger the select change event
			self.$select.trigger('change', [event]);

		if $group then $group.find('ul.bttr-options').append $option else @$list.append $option

	_parse: ()->
		@data = new BttrMultiselectParser @select
		console.log @data.parsed, 'select parsed'
		@_injectNodes();
		@parsed = true
	
	_addOptionToSelectedList: ($option, option)->
		$optionClone = $option.clone()

		# Hide the selected option
		$option.addClass('bttr-option-selected')

		$optionClone.append $('<a class="bttrmultiselect-option-remove"><i class="icon-remove"></i></a>')
			.on 'click', (event)=>
				event.stopPropagation()
				@_unRegisterNode(option)
				$option.removeClass('bttr-option-selected')
				$optionClone.remove()

			@$selectedList.append($optionClone);

	_unRegisterNode: (node) ->
		ref = @select
		if node.groupChildNodesIndex
			# Get the group element
			ref = @select.childNodes[node.groupChildNodesIndex]

		# UnSelect the option
		ref.childNodes[node.childNodesIndex].selected = false

		# Delete the nod from the selected list
		i = @selected.indexOf node
		if i isnt -1
			@selected.splice(i, 1);

		this.$bttrSelect.trigger('onSelectedUpdate', [@selected, node])
		console.log @selected, '_unRegisterNode'
	
	_registerNode: ($node, node) ->
	
		if node.group
			# Get the group element
			groupNode = @select.childNodes[node.childNodesIndex]
			for option in node.children
				# Select the option within the group
				console.log groupNode.childNodes[option.childNodesIndex].selected
				if !groupNode.childNodes[option.childNodesIndex].selected
					groupNode.childNodes[option.childNodesIndex].selected = true
					@_addOptionToSelectedList($node.find("[data-optionindex=#{ option.index }]"), option)
					@selected.push(option)
			$node.addClass('bttr-group-selected')
		else
			ref = @select
			if node.groupChildNodesIndex
				# Get the group element
				ref = @select.childNodes[node.groupChildNodesIndex]

			# Select the option
			if !ref.childNodes[node.childNodesIndex].selected
				ref.childNodes[node.childNodesIndex].selected = true
				@selected.push(node)

			@_addOptionToSelectedList($node, node)

		this.$bttrSelect.trigger('onSelectedUpdate', [@selected, node])
		console.log @selected, '_registerNode'

	###
	public Functions
	###

	bttrmultiselect: () ->
		return this

	open: () ->
		console.log 'opening'
		@$bttrSelect.addClass 'on'
		$(document).click @_testGlobalClick
		@opened = true
		# Parse Select
		if (!@parsed && @options.parse is 'onOpening')
			@_parse()

	close: () ->
		console.log 'closing'
		@$bttrSelect.removeClass 'on'
		$(document).unbind 'click', @_testGlobalClick
		@opened = false

	refresh: () ->
		console.log 'refreshing'
		@selected = []
		@_parse()

	checkAll: () ->
		console.log 'checking all'

	uncheckAll: () ->
		console.log 'unchecking all'

	enable: () ->
		console.log 'enabling'

	disable: () ->
		console.log 'disabling'

	getChecked: () ->
		console.log 'getting checked'
		@$select.find('option:checked')

	setOptions: (options) ->
		console.log 'setting options after initialization'

	destroy: () ->
		console.log 'destroying'
		@$select.removeClass "bttrmultiselect-done"