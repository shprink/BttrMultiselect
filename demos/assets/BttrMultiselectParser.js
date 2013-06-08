(function() {
  var BttrMultiselectParser;

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

}).call(this);
