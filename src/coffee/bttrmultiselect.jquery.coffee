root = this
$ = jQuery

$.fn.extend
		bttrmultiselect: (options) ->
				this.each(() ->
						$this = $(this)
						# Already instanciated?
						if !$this.hasClass "bttrmultiselect-done"
								# Is the select multiple?
								multiple = $this.attr 'multiple'
								if typeof multiple isnt 'undefined' and multiple isnt false
										console.log 'Instanciating BttrMultiselect'
										instance = new BttrMultiselect(this, options)
								else
										console.log 'Instanciating BttrSelect'
										instance = new BttrSelect(this, options)
								$this.data('bttrmultiselect', instance) unless $this.hasClass "bttrmultiselect-done"
				)