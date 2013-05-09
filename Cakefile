fs          	= require 'fs'
path        	= require 'path'
CoffeeScript	= require 'coffee-script'
UglifyJS 		= require 'uglify-js'
{exec} 			= require 'child_process'

files = {
  'bttrmultiselect/js/bttrmultiselect.jquery.js': [
    'coffee/bttrmultiselect.jquery.coffee'
    'coffee/lib/abstract-bttrmultiselect.coffee'
  ]
}

task 'build', 'build Chosen from source', ->
  file_name = null; file_contents = null
  try
    for file_js, files_coffee of files
      code = ''
      for file_coffee in files_coffee
        file_name = file_coffee
        file_contents = "#{fs.readFileSync file_coffee}"
        code += CoffeeScript.compile file_contents
      fs.writeFileSync file_js, code
      unless process.env.MINIFY is 'false'
        fs.writeFileSync file_js.replace(/\.js$/,'.min.js'), (
         UglifyJS.gen_code UglifyJS.ast_squeeze UglifyJS.ast_mangle UglifyJS.parse "test"
        ), ';'
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

