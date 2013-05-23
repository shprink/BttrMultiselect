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
		@$search = @$bttrSelect.find('div.bttrmultiselect-search')
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
			group_selector : true
			
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

	_setButtonWidth: () ->
		@$button.css('width', @width);

	_setContentWidth: () ->
		@$bttrSelect.css('width', @width);

	_setContentPosition: () ->
		pos = @$button.offset();
		@$bttrSelect.css
			'top': pos.top,
			'left': pos.left

	###
	public Functions
	###

	open: () ->
		@$bttrSelect.addClass 'on'
		@opened = true

	close: () ->
		@$bttrSelect.removeClass 'on'
		@opened = false

	refresh: () ->

		# Initiate data
		selectParser = root.SelectParser.parse @select
		@data = selectParser.parsed
		
		console.log @data

		# Set position 
		@_setButtonWidth();
		@_setContentWidth();
		@_setContentPosition();

		@selector = new Selector @$list, @data, @isMultiple
		
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