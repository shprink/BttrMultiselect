class BttrMultiselect
	options = 
		search : true
		group_selector : true
		is_multiple : null

	constructor: (@select, options) ->
	#	@options.is_multiple = @select.multiple
		# Make sure we instanciate once per element
		@select.addClass "bttrmultiselect-done"
		# Set options
		$.extend @options, options
		alert 'e'
		return
