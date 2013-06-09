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
		
				# We create our elements
				@$bttrSelect = $(@_getTemplate())
				@$button = @$bttrSelect.find('a.bttrmultiselect-button')
				@$search = @$bttrSelect.find('div.bttrmultiselect-search input')
				@$list = @$bttrSelect.find('ul.bttrmultiselect-list')
		
				# Insert BttrMultiselect
				@$bttrSelect.insertAfter(@$select);
		
				# Set the size
				@width = @$select.outerWidth()

				@_bindEvents()

				@$select.hide()
				
				# Set position 
				@_setButtonWidth();
				@_setContentWidth();
				@_setContentPosition();

				# Make sure we instanciate once per element
				@$select.addClass "bttrmultiselect-done"
		
				# close the content
				@opened = false
				
				# Parse Select
				if (@options.parse is 'onInstantiating')
						@_parse()
						
				return this
		
		###
	Private Functions
	###
		
		_getDefaultOptions: () ->
				options = 
						search : true
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
				$group.find('.bttr-group-label').append $('<input type="checkbox">') if !group.disabled

				self = this
				$group.find('input').click (event)->
						event.stopPropagation()
						self.$bttrSelect.trigger('onBeforeGroupSelect', [event, $(this), self])						
						# TODO
						# Remove node and Add it to the wish list
						
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

				if $group then $group.find('ul.bttr-options').append $option else @$list.append $option

		_parse: ()->
				@data = new BttrMultiselectParser @select
				console.log @data
				@_injectNodes();
				@parsed = true
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