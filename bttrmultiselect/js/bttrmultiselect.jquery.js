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
    function BttrMultiselect(select, options) {
      var multiple;

      this.select = select;
      this.options = options != null ? options : {};
      $.extend(this.options, this._getDefaultOptions(), this.options);
      multiple = this.select.attr('multiple');
      if (typeof multiple !== 'undefined' && multiple !== false) {
        this.multiple = true;
      } else {
        this.multiple = false;
      }
      this.button = $(this._getTemplate().button);
      this.content = $(this._getTemplate().content);
      this.content.insertAfter(this.select);
      this.button.insertAfter(this.select);
      this._bindEvents();
      this.select.hide();
      this.refresh();
      this.select.addClass("bttrmultiselect-done");
    }

    /*
    	Private Functions
    */


    BttrMultiselect.prototype._getDefaultOptions = function() {
      var options;

      return options = {
        search: true,
        group_selector: true,
        is_multiple: null
      };
    };

    BttrMultiselect.prototype._getTemplate = function() {
      var template;

      return template = {
        button: "<button type='button' class='bttrmultiselect'>\n	<span></span>\n	<b></b>\n</button>",
        content: "<div class='bttrmultiselect'>\n	<div class='bttrmultiselect-inner'>\n		<div class='bttrmultiselect-group'>\n			<div class='bttrmultiselect-header'></div>\n			<ul></ul>\n		</div>\n		<div class='bttrmultiselect-option'>\n			<div class='bttrmultiselect-header'></div>\n			<ul></ul>\n		</div>\n	</div>\n</div>"
      };
    };

    BttrMultiselect.prototype._bindEvents = function() {
      return this.button.on('click', function(event) {
        return alert('ee');
      });
    };

    /*
    	public Functions
    */


    BttrMultiselect.prototype.open = function() {};

    BttrMultiselect.prototype.close = function() {};

    BttrMultiselect.prototype.refresh = function() {
      var _this = this;

      return this.select.find('option').each(function(index) {
        var $this;

        return $this = $(_this);
      });
    };

    BttrMultiselect.prototype.checkAll = function() {};

    BttrMultiselect.prototype.uncheckAll = function() {};

    BttrMultiselect.prototype.enable = function() {};

    BttrMultiselect.prototype.disable = function() {};

    BttrMultiselect.prototype.getChecked = function() {
      return this.select.find('option:checked');
    };

    BttrMultiselect.prototype.setOptions = function(options) {};

    BttrMultiselect.prototype.destroy = function() {
      return this.select.removeClass("bttrmultiselect-done");
    };

    return BttrMultiselect;

  })();

  root = this;

  $ = jQuery;

  $.fn.extend({
    bttrmultiselect: function(options) {
      return this.each(function() {
        var $this;

        $this = $(this);
        if (!$this.hasClass("bttrmultiselect-done")) {
          return $this.data('bttrmultiselect', new BttrMultiselect($this, options));
        }
      });
    }
  });

}).call(this);
