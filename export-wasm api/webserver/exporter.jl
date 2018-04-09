# This file accepts three command line arguments
# 1) The name of a file containing a script that defines a function
# 2) The name of the function
# 3) A string with a list of types for the arguments of the function (like "Float64, Int64")

loadtime = @elapsed using ExportWebAssembly, JSON
println("Package load time: ", loadtime)
println(ARGS)

file_name = ARGS[1]

try
    # Need some serious sanitation here

    json_str = read(open(file_name), String)
    json_dict = JSON.parse(json_str)
    println(json_dict)

    # Need some serious sanitation here
    types = eval(Meta.parse(string("Tuple{", json_dict["types"], "}")))
    eval(Meta.parse(json_dict["script"]))
    fn = eval(Meta.parse(json_dict["function"]))

    outfile = string(file_name[1:end-5], ".js")
    println("Results will be written to ", outfile)
    fntime = @elapsed write_js(outfile, fn, types, include_init = true)
    println("write_js call time: ", fntime)
catch err
    error_response = string("Julia conversion error:\n\n", err)
    error(error_response)
end
