(function($) {
	if (typeof $.fn.each2 == "undefined") {
		$.fn.extend({
			/*
			 * 4-10 times faster .each replacement
			 * use it carefully, as it overrides jQuery context of element on each iteration
			 */
			each2: function(c) {
				var j = $([0]), i = -1, l = this.length;
				while (
						++i < l
						&& (j.context = j[0] = this[i])
						&& c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
						)
					;
				return this;
			}
		});
	}
})(jQuery);

var Select2Parser;

Select2Parser = (function() {
	function Select2Parser() {
		
	}
	
	    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    Select2Parser.prototype.equal = function(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        if (a.constructor === String) return a+'' === b+''; // IE requires a+'' instead of just a
        if (b.constructor === String) return b+'' === a+''; // IE requires b+'' instead of just b
        return false;
    };

	Select2Parser.prototype.optionToData = function(element) {
		if (element.is("option")) {
			return {
				id: element.prop("value"),
				text: element.text(),
				element: element.get(),
				css: element.attr("class"),
				disabled: element.prop("disabled"),
				locked: this.equal(element.attr("locked"), "locked")
			};
		} else if (element.is("optgroup")) {
			return {
				text: element.attr("label"),
				children: [],
				element: element.get(),
				css: element.attr("class")
			};
		}
	};

	Select2Parser.prototype.process = function(element, collection) {
		var group;
		var self = this;
		if (element.is("option")) {
			collection.push(this.optionToData(element));
		} else if (element.is("optgroup")) {
			group = this.optionToData(element);
			element.children().each2(function(i, elm) {
				self.process(elm, group.children);
			});
			if (group.children.length > 0) {
				collection.push(group);
			}
		}
	};


	return Select2Parser;

})();

Select2Parser.select_to_array = function($select) {
	var children = $select.children();
	var results = [];
	parser = new Select2Parser();
	children.each2(function(i, elm) { parser.process(elm, results); });
	return results;
};