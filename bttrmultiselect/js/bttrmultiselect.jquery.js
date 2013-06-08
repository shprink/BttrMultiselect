(function() {
  var $, BttrMultiselect, BttrMultiselectParser, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  BttrMultiselectParser = (function() {
    function BttrMultiselectParser(select) {
      var child, _i, _len, _ref;
      this.index = 0;
      this.hasGroup = false;
      this.parsed = [];
      _ref = select.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        this.addNode(child);
      }
      return this;
    }

    BttrMultiselectParser.prototype.addNode = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.addGroup(child);
      } else {
        return this.addOption(child);
      }
    };

    BttrMultiselectParser.prototype.addGroup = function(group) {
      var array_index, g, option, _i, _len, _ref, _results;
      this.hasGroup = true;
      array_index = this.parsed.length;
      g = {
        group: true,
        index: this.index,
        text: group.label,
        disabled: group.disabled,
        children: []
      };
      this.parsed.push(g);
      this.index += 1;
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.addOption(option, array_index, g.index, g.disabled));
      }
      return _results;
    };

    BttrMultiselectParser.prototype.addOption = function(option, array_index, group_index, group_disabled) {
      var o;
      if (option.nodeName.toUpperCase() === "OPTION") {
        o = {
          index: this.index
        };
        if (option.text !== "") {
          o.text = option.text;
          o.selected = option.selected;
          o.disabled = group_disabled === true ? group_disabled : option.disabled;
        } else {
          o.empty = true;
        }
        if (array_index) {
          this.parsed[array_index].children.push(o);
        } else {
          this.parsed.push(o);
        }
        return this.index += 1;
      }
    };

    return BttrMultiselectParser;

  })();

  BttrMultiselect = (function() {
    function BttrMultiselect(select, options) {
      var multiple;
      this.select = select;
      this.options = options != null ? options : {};
      this._testGlobalClick = __bind(this._testGlobalClick, this);
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
      this.$search = this.$bttrSelect.find('div.bttrmultiselect-search input');
      this.$list = this.$bttrSelect.find('ul.bttrmultiselect-list');
      this.$bttrSelect.insertAfter(this.$select);
      this.width = this.$select.outerWidth();
      this._bindEvents();
      this.$select.hide();
      this._setButtonWidth();
      this._setContentWidth();
      this._setContentPosition();
      this.$select.addClass("bttrmultiselect-done");
      this.opened = false;
      if (this.options.parse === 'onInstantiating') {
        this._parse();
      }
      return this;
    }

    /*
    	Private Functions
    */


    BttrMultiselect.prototype._getDefaultOptions = function() {
      var options;
      return options = {
        search: true,
        parse: 'onOpening',
        nodeMax: 50
      };
    };

    BttrMultiselect.prototype._getTemplate = function() {
      return "<div class='bttrmultiselect'>\n	<div class='bttrmultiselect-inner'>\n		<a href=\"javascript:void(0)\" class='bttrmultiselect-button'>\n			<span class=\"bttrmultiselect-selected\"></span>\n			<b></b>\n		</a>\n		<div class='bttrmultiselect-content'>\n			<div class='bttrmultiselect-search'>\n				<input type=\"text\" />\n			</div>\n			<ul class='bttrmultiselect-list'></ul>\n		</div>\n	</div>\n</div>";
    };

    BttrMultiselect.prototype._bindEvents = function() {
      var _this = this;
      this.$button.on('click', function(event) {
        if (_this.opened) {
          return _this.close();
        } else {
          return _this.open();
        }
      });
      return this.$bttrSelect.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(event) {
        if (_this.opened) {
          return _this.$search.focus();
        } else {
          _this.$search.blur();
          return _this._resetSearch();
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

    BttrMultiselect.prototype._resetSearch = function() {
      return this.$search.val('');
    };

    BttrMultiselect.prototype._testGlobalClick = function(event) {
      if (!this.$bttrSelect.find(event.target).length) {
        return this.close();
      }
    };

    BttrMultiselect.prototype._injectNodes = function() {
      var node, _i, _len, _ref, _results;
      this.$list.empty();
      _ref = this.data.parsed;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (node.group) {
          if (node.children.length > 0) {
            _results.push(this._injectGroup(node));
          } else {
            _results.push(void 0);
          }
        } else if (!node.empty) {
          _results.push(this._injectOption(node));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    BttrMultiselect.prototype._injectGroup = function(group) {
      var $group, classes, self;
      classes = [];
      classes.push("bttr-group");
      if (group.disabled) {
        classes.push("bttr-group-disabled");
      }
      $group = $("<li data-index=\"" + group.index + "\" class=\"" + (classes.join(' ')) + "\">\n	<div class=\"bttr-group-label\">\n				<i class=\"icon-folder-close-alt\"></i> " + group.text + "\n				<span>" + group.children.length + "</span>\n				<a href=\"javascript:void(0)\"><i class=\"icon-chevron-down\"></i></a>\n				<input type=\"checkbox\">\n	</div>\n	<ul class=\"bttr-options\" style=\"display:none\"></ul>\n</li>");
      self = this;
      $group.find('input').click(function(event) {
        event.stopPropagation();
        return self.$bttrSelect.trigger('onBeforeGroupSelect', [event, $(this)]);
      });
      $group.find('.bttr-group-label').click(function(event) {
        var icon, option, _i, _len, _ref,
          _this = this;
        icon = $(this).find('a i');
        if (!$(this).hasClass('optionsLoaded')) {
          icon.removeClass('icon-chevron-down');
          icon.addClass('icon-spinner icon-spin');
          _ref = group.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            option = _ref[_i];
            self._injectOption(option, $group);
          }
          icon.removeClass('icon-spinner icon-spin');
          icon.addClass('icon-chevron-down');
          $(this).addClass('optionsLoaded');
        }
        return $group.find('ul.bttr-options').toggle('slow', function() {
          if (icon.hasClass('icon-chevron-down')) {
            icon.removeClass('icon-chevron-down');
            icon.addClass('icon-chevron-up');
          } else {
            icon.removeClass('icon-chevron-up');
            icon.addClass('icon-chevron-down');
          }
          return self.$list.animate({
            scrollTop: $(_this).offset().top + (self.$list.scrollTop() - self.$list.offset().top)
          }, 200);
        });
      });
      return this.$list.append($group);
    };

    BttrMultiselect.prototype._injectOption = function(option, $group) {
      var $option, classes;
      classes = [];
      classes.push("bttr-option");
      if (option.disabled) {
        classes.push("bttr-option-disabled");
      }
      if (option.selected) {
        classes.push("bttr-option-selected");
      }
      $option = $("<li data-index=\"" + option.index + "\" class=\"" + (classes.join(' ')) + "\">\n	<div>" + option.text + "</div>\n</li>");
      if ($group) {
        return $group.find('ul.bttr-options').append($option);
      } else {
        return this.$list.append($option);
      }
    };

    BttrMultiselect.prototype._parse = function() {
      this.data = new BttrMultiselectParser(this.select);
      console.log(this.data);
      this._injectNodes();
      return this.parsed = true;
    };

    /*
    	public Functions
    */


    BttrMultiselect.prototype.bttrmultiselect = function() {
      return this;
    };

    BttrMultiselect.prototype.open = function() {
      this.$bttrSelect.addClass('on');
      $(document).click(this._testGlobalClick);
      this.opened = true;
      if (!this.parsed && this.options.parse === 'onOpening') {
        return this._parse();
      }
    };

    BttrMultiselect.prototype.close = function() {
      this.$bttrSelect.removeClass('on');
      $(document).unbind('click', this._testGlobalClick);
      return this.opened = false;
    };

    BttrMultiselect.prototype.refresh = function() {
      this._parse();
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
