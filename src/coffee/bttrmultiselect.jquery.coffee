root = this
$ = jQuery

$.fn.extend({
  bttrmultiselect: (options) ->
    return this
})

class BttrMultiselect extends AbstractBttrMultiselect

constructor: (@option={}) ->
		return

root.BttrMultiselect = BttrMultiselect
