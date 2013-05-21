(function() {
  var $, AbstractSelector, BttrMultiselect, SelectParser, SelectorGroup, SelectorList, root, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractSelector = (function() {
    function AbstractSelector(element, data) {
      this.element = element;
      this.element.html(this.parse(data));
    }

    AbstractSelector.prototype.addGroup = function(group) {
      if (!group.disabled) {
        group.dom_id = this.container_id + "_g_" + group.array_index;
        return '<li id="' + group.dom_id + '" class="group-result">' + $("<div />").text(group.label).html() + '</li>';
      } else {
        return "";
      }
    };

    return AbstractSelector;

  })();

  SelectorGroup = (function(_super) {
    __extends(SelectorGroup, _super);

    function SelectorGroup() {
      _ref = SelectorGroup.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SelectorGroup.prototype.parse = function(data) {
      var content, node, _i, _len;

      content = '';
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        node = data[_i];
        if (node.group) {
          content += this.addGroup(node);
        }
      }
      return content;
    };

    return SelectorGroup;

  })(AbstractSelector);

  SelectorList = (function(_super) {
    __extends(SelectorList, _super);

    function SelectorList() {
      _ref1 = SelectorList.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    SelectorList.prototype.parse = function(data) {
      var content, i, node, _i, _len;

      console.log(data.length);
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
      /*
      		if node.selected and @is_multiple
      			this.choice_build data
      		else if data.selected and not @is_multiple
      			@selected_item.removeClass("chzn-default").find("span").text data.text
      			this.single_deselect_control_build() if @allow_single_deselect
      */

    };

    SelectorList.prototype.addOption = function(option) {
      var classes, style;

      if (!option.disabled) {
        option.dom_id = this.container_id + "_o_" + option.array_index;
        classes = option.selected && this.is_multiple ? [] : ["active-result"];
        if (option.selected) {
          classes.push("result-selected");
        }
        if (option.group_array_index != null) {
          classes.push("group-option");
        }
        if (option.classes !== "") {
          classes.push(option.classes);
        }
        style = option.style.cssText !== "" ? " style=\"" + option.style + "\"" : "";
        return '<li id="' + option.dom_id + '" class="' + classes.join(' ') + '"' + style + '>' + option.html + '</li>';
      } else {
        return "";
      }
    };

    return SelectorList;

  })(AbstractSelector);

  /*
  Chosen Parser
  https://github.com/harvesthq/chosen/blob/master/coffee/lib/select-parser.coffee
  */


  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref2, _results;

      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        children: 0,
        disabled: group.disabled
      });
      _ref2 = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        option = _ref2[_i];
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

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref2;

    parser = new SelectParser();
    _ref2 = select.childNodes;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      child = _ref2[_i];
      parser.add_node(child);
    }
    return parser.parsed;
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
        this.multiple = true;
      } else {
        this.multiple = false;
      }
      this.$button = $(this._getTemplate().button);
      this.$content = $(this._getTemplate().content);
      this.$content.insertAfter(this.$select);
      this.$button.insertAfter(this.$select);
      this.width = this.$select.outerWidth();
      this.height = this.$select.outerHeight();
      this._bindEvents();
      this.$select.hide();
      this.refresh();
      this.$select.addClass("bttrmultiselect-done");
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
        content: "<div class='bttrmultiselect'>\n	<div class='bttrmultiselect-inner'>\n		<div class='bttrmultiselect-group'>\n			<div class='bttrmultiselect-header'></div>\n			<ul></ul>\n		</div>\n		<div class='bttrmultiselect-list'>\n			<div class='bttrmultiselect-header'></div>\n			<ul></ul>\n		</div>\n	</div>\n</div>"
      };
    };

    BttrMultiselect.prototype._bindEvents = function() {
      return this.$button.on('click', function(event) {
        return alert('ee');
      });
    };

    BttrMultiselect.prototype._setButtonWidth = function() {
      return this.$button.css('width', this.width);
    };

    BttrMultiselect.prototype._setContentWidth = function() {
      return this.$content.css('width', this.width);
    };

    BttrMultiselect.prototype._setContentPosition = function() {
      var pos;

      pos = this.$button.offset();
      return this.$content.css({
        'top': pos.top + this.height,
        'left': pos.left
      });
    };

    /*
    	public Functions
    */


    BttrMultiselect.prototype.open = function() {};

    BttrMultiselect.prototype.close = function() {};

    BttrMultiselect.prototype.refresh = function() {
      this.data = root.SelectParser.select_to_array(this.select);
      this._setButtonWidth();
      this._setContentWidth();
      this._setContentPosition();
      if (this.options.group_selector) {
        this.selector_group = new SelectorGroup(this.$content.find('.bttrmultiselect-group ul'), this.data);
        this.$content.addClass('to-group');
        this.$content.find('.bttrmultiselect-group').css('width', this.width);
        this.$content.find('.bttrmultiselect-list').css('left', this.width);
      } else {
        this.$content.addClass('to-list');
        this.selector_group = null;
      }
      this.selector = new SelectorList(this.$content.find('.bttrmultiselect-list ul'), this.data);
      this.$content.find('.bttrmultiselect-list').css('width', this.width);
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
