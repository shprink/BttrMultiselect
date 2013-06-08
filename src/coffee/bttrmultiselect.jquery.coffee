root = this
$ = jQuery

$.fn.extend
		bttrmultiselect: (options) ->
				this.each(() ->
						$this = $(this)
						$this.data('bttrmultiselect', new BttrMultiselect(this, options)) unless $this.hasClass "bttrmultiselect-done"
				)