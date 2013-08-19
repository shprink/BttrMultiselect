(function() {
  var $, AbstractBttr, BttrMultiselect, BttrMultiselectParser, BttrSelect, root, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
        childNodesIndex: index,
        index: array_index,
        text: group.label,
        disabled: group.disabled,
        children: []
      };
      this.parsed.push(g);
      _ref = group.childNodes;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        option = _ref[index];
        _results.push(this.addOption(option, index, array_index, g.children, g.childNodesIndex, g.disabled));
      }
      return _results;
    };

    BttrMultiselectParser.prototype.addOption = function(option, index, array_index, children, group_index, group_disabled) {
      var o, option_array_index;
      if (option.nodeName.toUpperCase() === "OPTION") {
        o = {
          childNodesIndex: index
        };
        if (group_index) {
          option_array_index = children.length;
          o.groupChildNodesIndex = group_index;
          o.groupIndex = array_index;
        } else {
          option_array_index = this.parsed.length;
        }
        o.index = option_array_index;
        if (option.text !== "") {
          o.text = option.text;
          o.selected = option.selected;
          o.disabled = group_disabled === true ? group_disabled : option.disabled;
        } else {
          o.empty = true;
        }
        if (children) {
          return children.push(o);
        } else {
          return this.parsed.push(o);
        }
      }
    };

    return BttrMultiselectParser;

  })();

  AbstractBttr = (function() {
    function AbstractBttr(select, options) {
      this.select = select;
      this.options = options != null ? options : {};
      this._testGlobalClick = __bind(this._testGlobalClick, this);
      this.$select = $(this.select);
      $.extend(this.options, this._getDefaultOptions(), this.options);
      this.$bttrSelect = $(this._getTemplate());
      this.$button = this.$bttrSelect.find('a.bttrmultiselect-button');
      this.$actions = this.$bttrSelect.find('ul.bttrmultiselect-actions');
      this.$search = this.$bttrSelect.find('div.bttrmultiselect-search input');
      this.$list = this.$bttrSelect.find('ul.bttrmultiselect-list');
      this.$selectedList = this.$bttrSelect.find('ul.bttrmultiselect-selected-list');
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
      return "<div class='bttrmultiselect'>\n	<div class='bttrmultiselect-inner'>\n		<a href=\"javascript:void(0)\" class='bttrmultiselect-button'>\n			<span class=\"bttrmultiselect-selected\"></span>\n			<b></b>\n		</a>\n		<div class='bttrmultiselect-content'>\n			<ul class='bttrmultiselect-actions'>\n				<li><i class='icon-search'></i></li>\n			</ul>\n			<div class='bttrmultiselect-search'>\n				<input type=\"text\" />\n			</div>\n			<ul class='bttrmultiselect-list'></ul>\n			<ul class='bttrmultiselect-selected-list'></ul>\n		</div>\n	</div>\n</div>";
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
      this.$bttrSelect.bind('onGroupSelection', function(evt, $group, $checkbox) {});
      this.$bttrSelect.bind('onOptionSelection', function(evt, $option) {});
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
      var index, node, _i, _len, _ref, _results;
      this.$list.empty();
      _ref = this.data.parsed;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        node = _ref[index];
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
      var $group, self;
      $group = this.formatGroup(group);
      self = this;
      $group.find('.bttr-group-label').click(function(event) {
        var icon, option, _i, _len, _ref,
          _this = this;
        icon = $(this).find('i');
        if (!$group.hasClass('optionsLoaded')) {
          icon.removeClass('icon-folder-close-alt');
          icon.addClass('icon-spinner icon-spin');
          _ref = group.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            option = _ref[_i];
            self._injectOption(option, $group);
          }
          icon.removeClass('icon-spinner icon-spin');
          icon.addClass('icon-folder-close-alt');
          $group.addClass('optionsLoaded');
        }
        return $group.find('ul.bttr-options').toggle(100, function() {
          if (icon.hasClass('icon-folder-close-alt')) {
            icon.removeClass('icon-folder-close-alt');
            icon.addClass('icon-folder-open-alt');
          } else {
            icon.removeClass('icon-folder-open-alt');
            icon.addClass('icon-folder-close-alt');
          }
          return self.$list.animate({
            scrollTop: $(_this).offset().top + (self.$list.scrollTop() - self.$list.offset().top)
          }, 50);
        });
      });
      return this.$list.append($group);
    };

    AbstractBttr.prototype._injectOption = function(option, $group) {
      var $option, self;
      $option = this.formatOption(option);
      self = this;
      $option.click(function(event) {
        self.$bttrSelect.trigger('onBeforeOptionSelection', [$(this), self]);
        self._registerNode($(this), option);
        self.$bttrSelect.trigger('onOptionSelection', [$(this), self]);
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
      console.log(this.data.parsed, 'select parsed');
      this._injectNodes();
      return this.parsed = true;
    };

    AbstractBttr.prototype._addOptionToSelectedList = function($option, option, $group) {
      var $selectedOption,
        _this = this;
      $option.addClass('bttr-option-selected');
      $selectedOption = this.formatSelectedOption(option);
      $selectedOption.delegate('.bttrmultiselect-option-remove', 'click', function(event) {
        event.stopPropagation();
        _this._unRegisterNode(option);
        $option.removeClass('bttr-option-selected');
        if ($group) {
          $group.removeClass('bttr-group-selected');
        }
        return $selectedOption.remove();
      });
      return this.$selectedList.append($selectedOption);
    };

    AbstractBttr.prototype._unRegisterNode = function(node) {
      var i, ref;
      ref = this.select;
      if (node.groupChildNodesIndex) {
        ref = this.select.childNodes[node.groupChildNodesIndex];
      }
      ref.childNodes[node.childNodesIndex].selected = false;
      i = this.selected.indexOf(node);
      if (i !== -1) {
        this.selected.splice(i, 1);
      }
      this.$bttrSelect.trigger('onSelectedUpdate', [this.selected, node]);
      return console.log(this.selected, '_unRegisterNode');
    };

    AbstractBttr.prototype._registerNode = function($node, node) {
      var groupNode, option, ref, _i, _len, _ref;
      if (node.group) {
        groupNode = this.select.childNodes[node.childNodesIndex];
        _ref = node.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          option = _ref[_i];
          if (!$node.hasClass('optionsLoaded')) {
            this._injectOption(option, $node);
          }
          if (!groupNode.childNodes[option.childNodesIndex].selected) {
            groupNode.childNodes[option.childNodesIndex].selected = true;
            this._addOptionToSelectedList($node.find("[data-optionindex=" + option.index + "]"), option, $node);
            this.selected.push(option);
          }
        }
        $node.addClass('optionsLoaded');
        $node.addClass('bttr-group-selected');
      } else {
        ref = this.select;
        if (node.groupChildNodesIndex) {
          ref = this.select.childNodes[node.groupChildNodesIndex];
        }
        if (!ref.childNodes[node.childNodesIndex].selected) {
          ref.childNodes[node.childNodesIndex].selected = true;
          this.selected.push(node);
        }
        this._addOptionToSelectedList($node, node);
      }
      this.$bttrSelect.trigger('onSelectedUpdate', [this.selected, node]);
      return console.log(this.selected, '_registerNode');
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

    AbstractBttr.prototype.formatGroup = function(group) {
      var $group, classes;
      classes = [];
      classes.push("bttr-group");
      if (group.disabled) {
        classes.push("bttr-group-disabled");
      }
      $group = $("<li data-groupindex=\"" + group.index + "\" class=\"" + (classes.join(' ')) + "\">\n	<div class=\"bttr-group-label\">\n		<i class=\"icon-folder-close-alt\"></i> " + group.text + "\n		<span>" + group.children.length + "</span>\n	</div>\n	<ul class=\"bttr-options\" style=\"display:none\"></ul>\n</li>");
      return $group;
    };

    AbstractBttr.prototype.formatOption = function(option) {
      var $option, classes;
      console.log('formating option');
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
      return $option;
    };

    AbstractBttr.prototype.formatSelectedOption = function(option) {
      var $option;
      console.log('formating selected option');
      $option = $("<li data-optionindex=\"" + option.index + "\">\n	<span>" + option.text + "</span>\n	<a class=\"bttrmultiselect-option-remove\"><i class=\"icon-remove\"></i></a>\n</li>");
      if (option.groupindex) {
        $option.attr('data-groupindex', option.groupindex);
      }
      return $option;
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

  BttrSelect = (function(_super) {
    __extends(BttrSelect, _super);

    function BttrSelect() {
      _ref = BttrSelect.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return BttrSelect;

  })(AbstractBttr);

  BttrMultiselect = (function(_super) {
    __extends(BttrMultiselect, _super);

    function BttrMultiselect() {
      _ref1 = BttrMultiselect.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    BttrMultiselect.prototype.formatGroup = function(group) {
      var $group, classes,
        _this = this;
      classes = [];
      classes.push("bttr-group");
      if (group.disabled) {
        classes.push("bttr-group-disabled");
      }
      $group = $("<li data-groupindex=\"" + group.index + "\" class=\"" + (classes.join(' ')) + "\">\n	<div class=\"bttr-group-label\">\n		<i class=\"icon-folder-close-alt\"></i> " + group.text + "\n		<span>" + group.children.length + "</span>\n	</div>\n	<ul class=\"bttr-options\" style=\"display:none\"></ul>\n</li>");
      if (!group.disabled) {
        $group.find('.bttr-group-label').append($('<input type="checkbox">'));
      }
      $group.find('input').click(function(event) {
        event.stopPropagation();
        _this.$bttrSelect.trigger('onBeforeGroupSelection', [$group, $(event.currentTarget), self]);
        _this._registerNode($group, group);
        _this.$bttrSelect.trigger('onGroupSelection', [$group, $(event.currentTarget), self]);
        return _this.$select.trigger('change', [event]);
      });
      return $group;
    };

    return BttrMultiselect;

  })(AbstractBttr);

  root = this;

  $ = jQuery;

  $.fn.extend({
    bttrmultiselect: function(options) {
      return this.each(function() {
        var $this, instance, multiple, publicMethods;
        console.log('in the loop');
        $this = $(this);
        if (!$this.hasClass("bttrmultiselect-done")) {
          multiple = $this.attr('multiple');
          if (typeof multiple !== 'undefined' && multiple !== false) {
            console.log('Instanciating BttrMultiselect');
            instance = new BttrMultiselect(this, options);
          } else {
            console.log('Instanciating BttrSelect');
            instance = new BttrSelect(this, options);
          }
          return $this.data('bttrmultiselect', instance);
        } else {
          publicMethods = ['open', 'close'];
          if (typeof options === 'string' && $.inArray(options, publicMethods) !== -1) {
            console.log('Running method ' + options);
            return $this.data('bttrmultiselect')[options]();
          }
        }
      });
    }
  });

}).call(this);
