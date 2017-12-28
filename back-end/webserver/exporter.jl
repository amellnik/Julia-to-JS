# This file accepts three command line arguments
# 1) The name of a file containing a script that defines a function
# 2) The name of the function
# 3) A string with a list of types for the arguments of the function (like "Float64, Int64")

loadtime = @elapsed using ExportWebAssembly
println("Package load time: ", loadtime)
println(ARGS)

length(ARGS) > 3 && error("Need to supply code, a function name, and types!")
file_name = ARGS[1]
fn_name = ARGS[2]

try
    # Need some serious sanitation here
    types = eval(parse(string("Tuple{", ARGS[3], "}")))

    include(file_name)
    # Need some serious sanitation here
    fn = eval(parse(fn_name))

    # export_bitcode(string(file_name[1:end-3], ".bc"), fn, types)
    fntime = @elapsed write_js(string(file_name[1:end-3], ".js"), fn, types, include_init = true)
    println("write_js call time: ", fntime)
catch err
    error_response = string("Julia conversion error:\n\n", err)
    error(error_response)
end
