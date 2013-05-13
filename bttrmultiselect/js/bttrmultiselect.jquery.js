(function() {
  var $, BttrMultiselect, root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = this;

  $ = jQuery;

  $.fn.extend({
    bttrmultiselect: function(options) {
      return this;
    }
  });

  BttrMultiselect = (function(_super) {

    __extends(BttrMultiselect, _super);

    function BttrMultiselect() {
      return BttrMultiselect.__super__.constructor.apply(this, arguments);
    }

    return BttrMultiselect;

  })(AbstractBttrMultiselect);

  ({
    constructor: function(option) {
      this.option = option != null ? option : {};
    }
  });

  root.BttrMultiselect = BttrMultiselect;

}).call(this);
(function() {
  var AbstractBttrMultiselect;

  AbstractBttrMultiselect = (function() {

    function AbstractBttrMultiselect(option) {
      this.option = option != null ? option : {};
      return;
    }

    return AbstractBttrMultiselect;

  })();

}).call(this);
