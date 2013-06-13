class BttrMultiselect

		constructor: (@select, @options = {}) ->
				@$select = $(@select)
				# Set options
				$.extend @options, @_getDefaultOptions(), @options

				# Is the select multiple?
				multiple = @$select.attr 'multiple'
				if typeof multiple isnt 'undefined' and multiple isnt false
						@isMultiple = true;
				else
						@isMultiple = false;
						
				console.log @isMultiple
		
				# We create our elements
				@$bttrSelect = $(@_getTemplate())
				@$button = @$bttrSelect.find('a.bttrmultiselect-button')
				@$search = @$bttrSelect.find('div.bttrmultiselect-search input')
				@$list = @$bttrSelect.find('ul.bttrmultiselect-list')
		
				# Insert BttrMultiselect
				@$bttrSelect.insertAfter(@$select);
		
				# Set the size
				@width = @$select.outerWidth()

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
						if $checkbox.is(':checked')
										setInterval(()->
												$group.remove();
										, 200)
										
				@$bttrSelect.bind 'onOptionSelection', (evt, $option) =>
						setInterval(()->
								$option.remove();
						, 200)
										
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
				for node in @data.parsed
						if node.group
								# No need to display empty groups
								if node.children.length > 0
										@_injectGroup node
						else if !node.empty
								@_injectOption node

		_injectGroup: (group) ->
				classes = []
				classes.push "bttr-group"
				classes.push "bttr-group-disabled" if group.disabled

				$group = $("""
				<li data-index="#{ group.index }" class="#{ classes.join(' ') }">
					<div class="bttr-group-label">
								<i class="icon-folder-close-alt"></i> #{ group.text }
								<span>#{ group.children.length }</span>
					</div>
					<ul class="bttr-options" style="display:none"></ul>
				</li>
				""")
				
				# Adding the checkbox input if the group is not disabled
				if !group.disabled && @isMultiple
						$group.find('.bttr-group-label').append $('<input type="checkbox">')

				self = this
				$group.find('input').click (event)->
						event.stopPropagation()
						self.$bttrSelect.trigger('onBeforeGroupSelection', [$group, $(this), self])						

						# Add Node to the wish list
						self._registerNode(group)

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
								self._injectOption option, $group for option in group.children
								# Removing the loading class
								icon.removeClass 'icon-spinner icon-spin'
								icon.addClass 'icon-folder-close-alt'
								$(this).addClass 'optionsLoaded'

						$group.find('ul.bttr-options').toggle 'slow', ()=>
								if icon.hasClass 'icon-folder-close-alt'
										icon.removeClass 'icon-folder-close-alt'
										icon.addClass 'icon-folder-open-alt'
								else
										icon.removeClass 'icon-folder-open-alt'
										icon.addClass 'icon-folder-close-alt'
								# Scroll to the group
								self.$list.animate({
										scrollTop: $(this).offset().top + (self.$list.scrollTop()- self.$list.offset().top)
								}, 200);

				# inject the group to the DOM
				@$list.append $group
				
		_injectOption: (option, $group) ->
				classes = []
				classes.push "bttr-option"
				classes.push "bttr-option-disabled" if option.disabled
				classes.push "bttr-option-selected" if option.selected

				$option = $("""
				<li data-index="#{ option.index }" class="#{ classes.join(' ') }">
					<div>#{ option.text }</div>
				</li>
				""")
				
				if option.groupindex
						$option.attr('data-groupindex', option.groupindex)
				
				self = this
				$option.click (event)->
						self.$bttrSelect.trigger('onBeforeOptionSelection', [$option, self])						

						# Add Node to the wish list
						self._registerNode(option)

						# Remove node
						self.$bttrSelect.trigger('onOptionSelection', [$option, self])						
						
						# trigger the select change event
						self.$select.trigger('change', [event]);

				if $group then $group.find('ul.bttr-options').append $option else @$list.append $option

		_parse: ()->
				@data = new BttrMultiselectParser @select
				#console.log @data.parsed, 'select parsed'
				@_injectNodes();
				@parsed = true
				
		# Binary search to get a node
		_findNode: (index) ->
				index = parseInt index
				@data.parsed.binarySearch(index, (object, find)->
						if object.index > find
								return 1
						else if object.index < find
								return -1
						else
								return 0
						)

		_unRegisterNode: (node) ->
				

		_registerNode: (node) ->
				if node.group
						# Get the group element
						groupNode = @select.childNodes[node.index]
						for option in node.children
								# Select the option within the group
								console.log groupNode.childNodes[option.index].selected
								if !groupNode.childNodes[option.index].selected
										groupNode.childNodes[option.index].selected = true
										@selected.push(option)
				else
						ref = @select
						if node.groupindex
								# Get the group element
								ref = @select.childNodes[node.groupindex]

						# Select the option
						if !ref.childNodes[node.index].selected
								ref.childNodes[node.index].selected = true
								@selected.push(node)

				this.$bttrSelect.trigger('onSelectedUpdate', [@selected, node])
				console.log @selected

		###
	public Functions
	###

		bttrmultiselect: () ->
				return this

		open: () ->
				@$bttrSelect.addClass 'on'
				$(document).click @_testGlobalClick
				@opened = true
				# Parse Select
				if (!@parsed && @options.parse is 'onOpening')
						@_parse()

		close: () ->
				@$bttrSelect.removeClass 'on'
				$(document).unbind 'click', @_testGlobalClick
				@opened = false

		refresh: () ->
				@selected = []
				@_parse()
				console.log 'refreshing'

		checkAll: () ->
	
		uncheckAll: () ->
	
		enable: () ->
	
		disable: () ->
	
		getChecked: () ->
				@$select.find('option:checked')
	
		setOptions: (options) ->
	
		destroy: () ->
				@$select.removeClass "bttrmultiselect-done"