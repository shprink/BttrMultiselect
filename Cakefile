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
		"#{ pathToCoffeeSource }bttrmultiselect.jquery.coffee"
		"#{ pathToCoffeeSource }lib/abstract-bttrmultiselect.coffee"
  ]
}

css_file = "#{ pathToCssBin }/bttrmultiselect.css"
less_file = "#{ pathToLessSource }bttrmultiselect.less"

task 'build', 'merge and uglify BttrMultiselect .less and .coffee', ->
	file_name = null; file_contents = null
	try
		# JS concat
		for file_js, files_coffee of js_files
			JScode = ''
			for file_coffee in files_coffee
				file_name = file_coffee
				file_contents = "#{fs.readFileSync file_coffee}"
				JScode += CoffeeScript.compile file_contents
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
		print_error e, file_name, file_contents

print_error = (error, file_name, file_contents) ->
	if error.location
		console.log CoffeeScript.helpers.prettyErrorMessage(error, file_name, file_contents, true)
	else
		console.log """
Error compiling #{file_name}:

#{error.message}

"""

