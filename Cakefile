fs            = require 'fs'
path          = require 'path'
CoffeeScript  = require 'coffee-script'
Less				  = require 'less'
{exec}        = require 'child_process'

pathToSource = 'src/'
pathToBin = 'bttrmultiselect/'
pathToCoffeeSource = "#{ pathToSource }coffee/"
pathToJsBin = "#{ pathToBin }js/"
pathToLessSource = "#{ pathToSource }less/"
pathToCssBin = "#{ pathToBin }css/"

js_files = {
	"bttrmultiselect/js/bttrmultiselect.jquery.js": [
		"#{ pathToCoffeeSource }lib/AbstractSelector.coffee"
		"#{ pathToCoffeeSource }lib/SelectorGroup.coffee"
		"#{ pathToCoffeeSource }lib/SelectorList.coffee"
		"#{ pathToCoffeeSource }lib/select-parser.coffee"
		"#{ pathToCoffeeSource }lib/BttrMultiselect.coffee"
		"#{ pathToCoffeeSource }bttrmultiselect.jquery.coffee"
  ]
}

css_file = "#{ pathToCssBin }/bttrmultiselect.css"
less_file = "#{ pathToLessSource }bttrmultiselect.less"

task 'build', 'merge and uglify BttrMultiselect .less and .coffee', ->
	try
		# JS concat
		for file_js, files_coffee of js_files
			JScode = CoffeeCode = ''
			for file_coffee in files_coffee
				file_name = file_coffee
				CoffeeCode += "#{fs.readFileSync file_coffee}\n"
			JScode += CoffeeScript.compile CoffeeCode
			fs.writeFileSync file_js, JScode

		# CSS concat
		file_name = less_file
		LessCode = "#{fs.readFileSync less_file}"
		Less.render LessCode, (e, css) ->
			fs.writeFileSync css_file, css

		unless process.env.MINIFY is 'false'
			Uglify			= require 'uglify-js'	
			CleanCSS		= require 'clean-css'
			# Compress JS
			fs.writeFileSync file_js.replace(/\.js$/,'.min.js'), (Uglify.minify JScode, {fromString: true}).code
			# Compress CSS
			fs.writeFileSync css_file.replace(/\.css$/,'.min.css'), CleanCSS.process "#{fs.readFileSync css_file}"

	catch e
		console.log e.message
