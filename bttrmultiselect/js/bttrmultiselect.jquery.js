(function() {
  var $, AbstractSelector, BttrMultiselect, SelectorGroup, SelectorOption, root,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractSelector = (function() {

    function AbstractSelector() {
      return;
    }

    return AbstractSelector;

  })();

  SelectorGroup = (function(_super) {

    __extends(SelectorGroup, _super);

    function SelectorGroup() {
      return;
    }

    return SelectorGroup;

  })(AbstractSelector);

  SelectorOption = (function(_super) {

    __extends(SelectorOption, _super);

    function SelectorOption() {
      return;
    }

    return SelectorOption;

  })(AbstractSelector);

  BttrMultiselect = (function() {
    var options;

    options = {
      search: true,
      group_selector: true
    };

    function BttrMultiselect(options) {
      $.extend(this.options, options);
      alert('e');
      return;
    }

    return BttrMultiselect;

  })();

  root = this;

  $ = jQuery;

  $.fn.extend({
    bttrmultiselect: function(options) {
      return new BttrMultiselect(options);
    }
  });

}).call(this);
