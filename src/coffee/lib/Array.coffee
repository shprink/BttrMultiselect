Array::searchSubstring = (term) ->
	r = new RegExp term, 'i'
	for i,j in this
		if r.test(i) then j else continue