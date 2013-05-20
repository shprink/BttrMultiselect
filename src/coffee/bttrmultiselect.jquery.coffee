root = this
$ = jQuery

$.fn.extend
  # Change pluginName to your plugin's name.
	bttrmultiselect: (options) ->
		this.each(() ->
			$this = $(this)
			$this.data('bttrmultiselect', new BttrMultiselect(this, options)) unless $this.hasClass "bttrmultiselect-done"
		)