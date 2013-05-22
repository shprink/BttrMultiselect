class BttrMultiselect

	constructor: (@select, @options = {}) ->
		@$select = $(@select)
		# Set options
		$.extend @options, @_getDefaultOptions(), @options

		# Is the select multiple?
		multiple = @$select.attr 'multiple'
		if typeof multiple isnt 'undefined' and multiple isnt false
			@multiple = true;
		else
			@multiple = false;
		
		# We create our elements
		@$button = $(@_getTemplate().button)
		@$content = $(@_getTemplate().content)
		
		# Insert BttrMultiselect
		@$content.insertAfter(@$select);
		@$button.insertAfter(@$select);
		
		# Set the size
		@width = @$select.outerWidth()
		@height = @$select.outerHeight()

		@_bindEvents()

		@$select.hide()
		this.refresh()

		# Make sure we instanciate once per element
		@$select.addClass "bttrmultiselect-done"
		
	###
	Private Functions
	###
		
	_getDefaultOptions: () ->
		options = 
			search : true
			group_selector : true
			is_multiple : null
			
	_getTemplate: () ->
		template = 
			button : """
				<button type='button' class='bttrmultiselect'>
					<span></span>
					<b></b>
				</button>
				"""
			content : """
				<div class='bttrmultiselect'>
					<div class='bttrmultiselect-inner'>
						<div class='bttrmultiselect-group'>
							<div class='bttrmultiselect-header'></div>
							<ul></ul>
						</div>
						<div class='bttrmultiselect-list'>
							<div class='bttrmultiselect-header'></div>
							<ul></ul>
						</div>
					</div>
				</div>
			"""

	_bindEvents: () ->
		@$button.on 'click', (event) ->
			alert('ee')
			
	_setButtonWidth: () ->
		@$button.css('width', @width);
		
	_setContentWidth: () ->
		@$content.css('width', @width);
		#if @hasGroup and @options.group_selector
			#@$content.find('.bttrmultiselect-inner').css('width', 2 * @width);
		
	_setContentPosition: () ->
		pos = @$button.offset();
		@$content.css
			'top': pos.top + @height,
			'left': pos.left
			
	_toGroup: () ->
		@$content.addClass('to-group');

	_toList: () ->
		@$content.addClass('to-list');

	###
	public Functions
	###
		
	open: () ->

	close: () ->

	refresh: () ->

		# Initiate data
		selectParser = root.SelectParser.parse @select
		@data = selectParser.parsed
		@hasGroup = selectParser.hasGroup

		# Set position 
		@_setButtonWidth();
		@_setContentWidth();
		@_setContentPosition();
		
		if @hasGroup and @options.group_selector
			@selector_group = new SelectorGroup @$content.find('.bttrmultiselect-group ul'), @data, @multiple
			@_toGroup()
			@$content.find('.bttrmultiselect-group').css('width', @width);
			@$content.find('.bttrmultiselect-list').css('left', @width);
		else
			@_toList()
			@selector_group = null;
			@$content.find('.bttrmultiselect-group').hide();

		@selector = new SelectorList @$content.find('.bttrmultiselect-list ul'), @data, @multiple
		@$content.find('.bttrmultiselect-list').css('width', @width);
		
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