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
				this.refresh()

				# Make sure we instanciate once per element
				@$select.addClass "bttrmultiselect-done"
		
				# close the content
				@opened = false
		
		###
	Private Functions
	###
		
		_getDefaultOptions: () ->
				options = 
						search : true
						parsing_on_instanciation : true
			
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
								@_injectGroup node
						else if !node.empty
								@_injectOption node

		_injectGroup: (group) ->
				classes = []
				classes.push "bttr-group"
				classes.push "bttr-group-disabled" if group.disabled

				$group = $("""
				<li data-index="#{ group.index }" class="#{ classes.join(' ') }">
					<div>#{ group.text }<span>#{ group.children.length }</span></div>
					<ul class="bttr-options"></ul>
				</li>
				""")

				# inject the group to the DOM
				@$list.append $group
				# Then doing the same for each children
				@_injectOption option, $group for option in group.children
				
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

		###
	public Functions
	###

		open: () ->
				@$bttrSelect.addClass 'on'
				$(document).click @_testGlobalClick
				@opened = true

		close: () ->
				@$bttrSelect.removeClass 'on'
				$(document).unbind 'click', @_testGlobalClick
				@opened = false

		refresh: () ->
				# Initiate data		
				@data = new BttrMultiselectParser @select

				# Set position 
				@_setButtonWidth();
				@_setContentWidth();
				@_setContentPosition();
				@_injectNodes();
		
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