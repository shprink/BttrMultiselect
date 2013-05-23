(function() {
  var $, BttrMultiselect, SelectParser, Selector, root;

  Selector = (function() {
    function Selector(element, data, multiple) {
      this.element = element;
      this.multiple = multiple;
      this.element.html(this.parse(data));
    }

    Selector.prototype.parse = function(data) {
      var content, i, node, _i, _len;
      content = '';
      i = 0;
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        node = data[_i];
        if (node.group) {
          i++;
          content += this.addGroup(node);
        } else if (!node.empty) {
          content += this.addOption(node);
        }
      }
      return content;
    };

    Selector.prototype.addGroup = function(group) {
      var classes;
      classes = [];
      classes.push("bttr-group");
      if (group.disabled) {
        classes.push("bttr-group-disabled");
      }
      return "<li data-index=\"" + group.array_index + "\" class=\"" + (classes.join(' ')) + "\">\n	<div>" + group.label + "<span>" + group.children + "</span></div>\n</li>";
    };

    Selector.prototype.addOption = function(option) {
      var classes;
      option.dom_id = this.container_id + "_o_" + option.array_index;
      classes = [];
      classes.push("bttr-option");
      if (option.disabled) {
        classes.push("bttr-option-disabled");
      }
      if (option.selected) {
        classes.push("bttr-option-selected");
      }
      return "<li data-index=\"" + option.array_index + "\" class=\"" + (classes.join(' ')) + "\">\n	<div>" + option.html + "</div>\n</li>";
    };

    return Selector;

  })();

  /*
  Chosen Parser
  https://github.com/harvesthq/chosen/blob/master/coffee/lib/select-parser.coffee
  */


  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
      this.hasGroup = false;
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        this.add_group(child);
        if (!child.disabled && !this.hasGroup) {
          return this.hasGroup = true;
        }
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    return SelectParser;

  })();

  SelectParser.parse = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser;
  };

  this.SelectParser = SelectParser;

  BttrMultiselect = (function() {
    function BttrMultiselect(select, options) {
      var multiple;
      this.select = select;
      this.options = options != null ? options : {};
      this.$select = $(this.select);
      $.extend(this.options, this._getDefaultOptions(), this.options);
      multiple = this.$select.attr('multiple');
      if (typeof multiple !== 'undefined' && multiple !== false) {
        this.isMultiple = true;
      } else {
        this.isMultiple = false;
      }
      this.$bttrSelect = $(this._getTemplate());
      this.$button = this.$bttrSelect.find('a.bttrmultiselect-button');
      this.$search = this.$bttrSelect.find('div.bttrmultiselect-search');
      this.$list = this.$bttrSelect.find('ul.bttrmultiselect-list');
      this.$bttrSelect.insertAfter(this.$select);
      this.width = this.$select.outerWidth();
      this._bindEvents();
      this.$select.hide();
      this.refresh();
      this.$select.addClass("bttrmultiselect-done");
      this.opened = false;
    }

    /*
    	Private Functions
    */


    BttrMultiselect.prototype._getDefaultOptions = function() {
      var options;
      return options = {
        search: true,
        group_selector: true
      };
    };

    BttrMultiselect.prototype._getTemplate = function() {
      return "<div class='bttrmultiselect'>\n	<div class='bttrmultiselect-inner'>\n		<a href=\"javascript:void(0)\" class='bttrmultiselect-button'>\n			<span class=\"bttrmultiselect-selected\"></span>\n			<b></b>\n		</a>\n		<div class='bttrmultiselect-content'>\n			<div class='bttrmultiselect-search'>\n				<input type=\"text\" />\n			</div>\n			<ul class='bttrmultiselect-list'></ul>\n		</div>\n	</div>\n</div>";
    };

    BttrMultiselect.prototype._bindEvents = function() {
      var _this = this;
      return this.$button.on('click', function(event) {
        if (_this.opened) {
          return _this.close();
        } else {
          return _this.open();
        }
      });
    };

    BttrMultiselect.prototype._setButtonWidth = function() {
      return this.$button.css('width', this.width);
    };

    BttrMultiselect.prototype._setContentWidth = function() {
      return this.$bttrSelect.css('width', this.width);
    };

    BttrMultiselect.prototype._setContentPosition = function() {
      var pos;
      pos = this.$button.offset();
      return this.$bttrSelect.css({
        'top': pos.top,
        'left': pos.left
      });
    };

    /*
    	public Functions
    */


    BttrMultiselect.prototype.open = function() {
      this.$bttrSelect.addClass('on');
      return this.opened = true;
    };

    BttrMultiselect.prototype.close = function() {
      this.$bttrSelect.removeClass('on');
      return this.opened = false;
    };

    BttrMultiselect.prototype.refresh = function() {
      var selectParser;
      selectParser = root.SelectParser.parse(this.select);
      this.data = selectParser.parsed;
      console.log(this.data);
      this._setButtonWidth();
      this._setContentWidth();
      this._setContentPosition();
      this.selector = new Selector(this.$list, this.data, this.isMultiple);
      return console.log('refreshing');
    };

    BttrMultiselect.prototype.checkAll = function() {};

    BttrMultiselect.prototype.uncheckAll = function() {};

    BttrMultiselect.prototype.enable = function() {};

    BttrMultiselect.prototype.disable = function() {};

    BttrMultiselect.prototype.getChecked = function() {
      return this.$select.find('option:checked');
    };

    BttrMultiselect.prototype.setOptions = function(options) {};

    BttrMultiselect.prototype.destroy = function() {
      return this.$select.removeClass("bttrmultiselect-done");
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
          return $this.data('bttrmultiselect', new BttrMultiselect(this, options));
        }
      });
    }
  });

}).call(this);
