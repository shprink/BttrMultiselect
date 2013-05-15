class BttrMultiselect
	
	template = """
		<div class='bttrmultiselect'>
			<div class='bttrmultiselect-inner'>
				<div class='bttrmultiselect-group'>
					<div class='bttrmultiselect-header'></div>
					<ul></ul>
				</div>
				<div class='bttrmultiselect-option'>
					<div class='bttrmultiselect-header'></div>
					<ul></ul>
				</div>
			</div>
		</div>
		"""
	
	options = 
		search : true
		group_selector : true
		is_multiple : null
		
	# local variables
	checked = []
	multiple = null

	constructor: (@select, options) ->
		# Make sure we instanciate once per element
		@select.addClass "bttrmultiselect-done"
		
		# Is the select multiple?
		multiple = @select.attr 'multiple'
		if typeof multiple isnt 'undefined' and multiple isnt false
			@multiple = true;
		else
			@multiple = false;

		@select.hide()
		this.refresh()
		
		@template
		# Set options
		$.extend @options, options
		
	open: () ->

	close: () ->

	refresh: () ->
		@select.find('option').each (index) =>
			$this = $(this)

	checkAll: () ->
	
	uncheckAll: () ->
	
	enable: () ->
	
	disable: () ->
	
	getChecked: () ->
		@checked
	
	setOptions: (options) ->
	
	destroy: () ->
		@select.removeClass "bttrmultiselect-done"
	
	_bindEvents: () ->
