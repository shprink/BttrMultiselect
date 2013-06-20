(function() {
  var $, AbstractBttr, BttrMultiselect, BttrMultiselectParser, BttrSingle, root, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Array.prototype.searchSubstring = function(term) {
    var i, j, r, _i, _len, _results;

    r = new RegExp(term, 'i');
    _results = [];
    for (j = _i = 0, _len = this.length; _i < _len; j = ++_i) {
      i = this[j];
      if (r.test(i)) {
        _results.push(j);
      } else {
        continue;
      }
    }
    return _results;
  };

  Array.prototype.binarySearch = function(find, comparator) {
    var comparison, high, i, low;

    low = 0;
    high = this.length - 1;
    console.log(find, 'find');
    while (low <= high) {
      console.log(high, 'high');
      console.log(low, 'low');
      i = Math.floor((low + high) / 2);
      comparison = comparator(this[i], find);
      console.log(comparison, 'comparison');
      if (comparison < 0) {
        low = i + 1;
        continue;
      }
      if (comparison > 0) {
        high = i - 1;
        continue;
      }
      return this[i];
    }
    return null;
  };

  BttrMultiselectParser = (function() {
    function BttrMultiselectParser(select) {
      var child, index, _i, _len, _ref;

      this.totalNode = 0;
      this.hasGroup = false;
      this.parsed = [];
      _ref = select.childNodes;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        child = _ref[index];
        this.addNode(child, index);
      }
      return this;
    }

    BttrMultiselectParser.prototype.addNode = function(child, index) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.addGroup(child, index);
      } else {
        return this.addOption(child, index);
      }
    };

    BttrMultiselectParser.prototype.addGroup = function(group, index) {
      var array_index, g, option, _i, _len, _ref, _results;

      this.hasGroup = true;
      array_index = this.parsed.length;
      g = {
        group: true,
        index: index,
        text: group.label,
        disabled: group.disabled,
        children: []
      };
      this.parsed.push(g);
      _ref = group.childNodes;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        option = _ref[index];
        _results.push(this.addOption(option, index, array_index, g.index, g.disabled));
      }
      return _results;
    };

    BttrMultiselectParser.prototype.addOption = function(option, index, array_index, group_index, group_disabled) {
      var o;

      if (option.nodeName.toUpperCase() === "OPTION") {
        o = {
          index: index
        };
        if (group_index) {
          o.groupindex = group_index;
        }
        if (option.text !== "") {
          o.text = option.text;
          o.selected = option.selected;
          o.disabled = group_disabled === true ? group_disabled : option.disabled;
        } else {
          o.empty = true;
        }
        if (array_index) {
          return this.parsed[array_index].children.push(o);
        } else {
          return this.parsed.push(o);
        }
      }
    };

    return BttrMultiselectParser;

  })();

  AbstractBttr = (function() {
    function AbstractBttr(select, options) {
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
      console.log(this.isMultiple);
      this.$bttrSelect = $(this._getTemplate());
      this.$button = this.$bttrSelect.find('a.bttrmultiselect-button');
      this.$search = this.$bttrSelect.find('div.bttrmultiselect-search input');
      this.$list = this.$bttrSelect.find('ul.bttrmultiselect-list');
      this.$bttrSelect.insertAfter(this.$select);
      this.width = this.$select.outerWidth();
      if (this.$select.is(':disabled')) {
        this.disable();
      }
      this.$select.hide();
      this._setButtonWidth();
      this._setContentWidth();
      this._setContentPosition();
      this.$select.addClass("bttrmultiselect-done");
      this.opened = false;
      this.selected = [];
      if (this.options.parse === 'onInstantiating') {
        this._parse();
      }
      this._bindEvents();
      this._setupListeners();
      return this;
    }

    /*
    	Private Functions
    */


    AbstractBttr.prototype._getDefaultOptions = function() {
      var options;

      return options = {
        search: {
          enabled: true,
          opened: false
        },
        parse: 'onOpening',
        nodeMax: 50
      };
    };

    AbstractBttr.prototype._getTemplate = function() {
      return "<div class='bttrmultiselect'>\n	<div class='bttrmultiselect-inner'>\n		<a href=\"javascript:void(0)\" class='bttrmultiselect-button'>\n			<span class=\"bttrmultiselect-selected\"></span>\n			<b></b>\n		</a>\n		<div class='bttrmultiselect-content'>\n			<div class='bttrmultiselect-search'>\n				<input type=\"text\" />\n			</div>\n			<ul class='bttrmultiselect-list'></ul>\n		</div>\n	</div>\n</div>";
    };

    AbstractBttr.prototype._bindEvents = function() {
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

    AbstractBttr.prototype._setupListeners = function() {
      var _this = this;

      this.$bttrSelect.bind('onGroupSelection', function(evt, $group, $checkbox) {
        if ($checkbox.is(':checked')) {
          return $group.remove();
        }
      });
      this.$bttrSelect.bind('onOptionSelection', function(evt, $option) {
        return $option.remove();
      });
      this.$bttrSelect.bind('onSelectedUpdate', function(evt, selected, node) {
        console.log(selected.length, 'selected.length');
        return _this.$button.find('.bttrmultiselect-selected').text(selected.length);
      });
      return this.$select.bind('refreshed', function(evt) {
        _this.refresh(evt);
      });
    };

    AbstractBttr.prototype._setButtonWidth = function() {
      return this.$button.css('width', this.width);
    };

    AbstractBttr.prototype._setContentWidth = function() {
      return this.$bttrSelect.css('width', this.width);
    };

    AbstractBttr.prototype._setContentPosition = function() {
      var pos;

      pos = this.$button.offset();
      return this.$bttrSelect.css({
        'top': pos.top,
        'left': pos.left
      });
    };

    AbstractBttr.prototype._resetSearch = function() {
      return this.$search.val('');
    };

    AbstractBttr.prototype._testGlobalClick = function(event) {
      if (!this.$bttrSelect.find(event.target).length) {
        return this.close();
      }
    };

    AbstractBttr.prototype._injectNodes = function() {
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

    AbstractBttr.prototype._injectGroup = function(group) {
      var $group, classes, self;

      classes = [];
      classes.push("bttr-group");
      if (group.disabled) {
        classes.push("bttr-group-disabled");
      }
      $group = $("<li data-groupindex=\"" + group.index + "\" class=\"" + (classes.join(' ')) + "\">\n	<div class=\"bttr-group-label\">\n				<i class=\"icon-folder-close-alt\"></i> " + group.text + "\n				<span>" + group.children.length + "</span>\n	</div>\n	<ul class=\"bttr-options\" style=\"display:none\"></ul>\n</li>");
      if (!group.disabled && this.isMultiple) {
        $group.find('.bttr-group-label').append($('<input type="checkbox">'));
      }
      self = this;
      $group.find('input').click(function(event) {
        event.stopPropagation();
        self.$bttrSelect.trigger('onBeforeGroupSelection', [$group, $(this), self]);
        self._registerNode(group);
        self.$bttrSelect.trigger('onGroupSelection', [$group, $(this), self]);
        return self.$select.trigger('change', [event]);
      });
      $group.find('.bttr-group-label').click(function(event) {
        var icon, option, _i, _len, _ref,
          _this = this;

        icon = $(this).find('i');
        if (!$(this).hasClass('optionsLoaded')) {
          icon.removeClass('icon-folder-close-alt');
          icon.addClass('icon-spinner icon-spin');
          _ref = group.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            option = _ref[_i];
            self._injectOption(option, $group);
          }
          icon.removeClass('icon-spinner icon-spin');
          icon.addClass('icon-folder-close-alt');
          $(this).addClass('optionsLoaded');
        }
        return $group.find('ul.bttr-options').toggle('slow', function() {
          if (icon.hasClass('icon-folder-close-alt')) {
            icon.removeClass('icon-folder-close-alt');
            icon.addClass('icon-folder-open-alt');
          } else {
            icon.removeClass('icon-folder-open-alt');
            icon.addClass('icon-folder-close-alt');
          }
          return self.$list.animate({
            scrollTop: $(_this).offset().top + (self.$list.scrollTop() - self.$list.offset().top)
          }, 200);
        });
      });
      return this.$list.append($group);
    };

    AbstractBttr.prototype._injectOption = function(option, $group) {
      var $option, classes, self;

      classes = [];
      classes.push("bttr-option");
      if (option.disabled) {
        classes.push("bttr-option-disabled");
      }
      if (option.selected) {
        classes.push("bttr-option-selected");
      }
      $option = $("<li data-optionindex=\"" + option.index + "\" class=\"" + (classes.join(' ')) + "\">\n	<div>" + option.text + "</div>\n</li>");
      if (option.groupindex) {
        $option.attr('data-groupindex', option.groupindex);
      }
      self = this;
      $option.click(function(event) {
        self.$bttrSelect.trigger('onBeforeOptionSelection', [$option, self]);
        self._registerNode(option);
        self.$bttrSelect.trigger('onOptionSelection', [$option, self]);
        return self.$select.trigger('change', [event]);
      });
      if ($group) {
        return $group.find('ul.bttr-options').append($option);
      } else {
        return this.$list.append($option);
      }
    };

    AbstractBttr.prototype._parse = function() {
      this.data = new BttrMultiselectParser(this.select);
      this._injectNodes();
      return this.parsed = true;
    };

    AbstractBttr.prototype._findNode = function(array, index) {
      if (!array) {
        return {};
      }
      return array.binarySearch(index, function(object, find) {
        if (object.index > find) {
          return 1;
        } else if (object.index < find) {
          return -1;
        } else {
          return 0;
        }
      });
    };

    AbstractBttr.prototype._findGroup = function(groupIndex) {
      return this._findNode(this.data.parsed, groupIndex);
    };

    AbstractBttr.prototype._findOption = function(optionIndex, groupIndex) {
      var group;

      if (groupIndex) {
        group = this._findNode(this.data.parsed, groupIndex);
        return this._findNode(group.chidren, optionIndex);
      }
      return this._findNode(this.data.parsed, optionIndex);
    };

    AbstractBttr.prototype._unRegisterNode = function(node) {
      if (node.groupindex) {
        if (this.$list.has("[data-groupindex=" + node.groupindex + "]")) {
          return this._injectOption(node, this.$list.find("[data-groupindex=" + node.groupindex + "]"));
        } else {
          return this._injectGroup(this._findGroup(node.groupindex));
        }
      } else {
        return this._injectOption(node);
      }
    };

    AbstractBttr.prototype._registerNode = function(node) {
      var groupNode, option, ref, _i, _len, _ref;

      if (node.group) {
        groupNode = this.select.childNodes[node.index];
        _ref = node.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          option = _ref[_i];
          console.log(groupNode.childNodes[option.index].selected);
          if (!groupNode.childNodes[option.index].selected) {
            groupNode.childNodes[option.index].selected = true;
            this.selected.push(option);
          }
        }
      } else {
        ref = this.select;
        if (node.groupindex) {
          ref = this.select.childNodes[node.groupindex];
        }
        if (!ref.childNodes[node.index].selected) {
          ref.childNodes[node.index].selected = true;
          this.selected.push(node);
        }
      }
      this.$bttrSelect.trigger('onSelectedUpdate', [this.selected, node]);
      return console.log(this.selected);
    };

    /*
    	public Functions
    */


    AbstractBttr.prototype.bttrmultiselect = function() {
      return this;
    };

    AbstractBttr.prototype.open = function() {
      console.log('opening');
      this.$bttrSelect.addClass('on');
      $(document).click(this._testGlobalClick);
      this.opened = true;
      if (!this.parsed && this.options.parse === 'onOpening') {
        return this._parse();
      }
    };

    AbstractBttr.prototype.close = function() {
      console.log('closing');
      this.$bttrSelect.removeClass('on');
      $(document).unbind('click', this._testGlobalClick);
      return this.opened = false;
    };

    AbstractBttr.prototype.refresh = function() {
      console.log('refreshing');
      this.selected = [];
      return this._parse();
    };

    AbstractBttr.prototype.checkAll = function() {
      return console.log('checking all');
    };

    AbstractBttr.prototype.uncheckAll = function() {
      return console.log('unchecking all');
    };

    AbstractBttr.prototype.enable = function() {
      return console.log('enabling');
    };

    AbstractBttr.prototype.disable = function() {
      return console.log('disabling');
    };

    AbstractBttr.prototype.getChecked = function() {
      console.log('getting checked');
      return this.$select.find('option:checked');
    };

    AbstractBttr.prototype.setOptions = function(options) {
      return console.log('setting options after initialization');
    };

    AbstractBttr.prototype.destroy = function() {
      console.log('destroying');
      return this.$select.removeClass("bttrmultiselect-done");
    };

    return AbstractBttr;

  })();

  BttrSingle = (function(_super) {
    __extends(BttrSingle, _super);

    function BttrSingle() {
      _ref = BttrSingle.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return BttrSingle;

  })(AbstractBttr);

  BttrMultiselect = (function(_super) {
    __extends(BttrMultiselect, _super);

    function BttrMultiselect() {
      _ref1 = BttrMultiselect.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return BttrMultiselect;

  })(AbstractBttr);

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
