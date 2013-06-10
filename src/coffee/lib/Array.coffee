Array::searchSubstring = (term) ->
		r = new RegExp term, 'i'
		for i,j in this
				if r.test(i) then j else continue
		
Array::binarySearch = (find, comparator) ->
  low = 0
		high = this.length - 1
		console.log find, 'find'
  while (low <= high)
				console.log high, 'high'
				console.log low, 'low'
    i = Math.floor((low + high) / 2)
    comparison = comparator(this[i], find);
				console.log comparison, 'comparison'
    if (comparison < 0)
						low = i + 1; continue
    if (comparison > 0)
						high = i - 1; continue
    return this[i];
  return null