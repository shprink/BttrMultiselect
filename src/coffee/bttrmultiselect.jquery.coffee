root = this
$ = jQuery

$.fn.extend
	bttrmultiselect: (options) ->
		this.each () ->
			console.log('in the loop')
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
				$this.data 'bttrmultiselect', instance
			else
				publicMethods = ['open', 'close']
				if typeof options is 'string' and $.inArray(options, publicMethods) isnt -1
					console.log 'Running method ' + options
					$this.data('bttrmultiselect')[options]()