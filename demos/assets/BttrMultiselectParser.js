(function() {
  var BttrMultiselectParser;

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

}).call(this);
