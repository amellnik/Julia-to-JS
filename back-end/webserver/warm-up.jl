# This file does a bunch of julia package setup stuff to make things run faster when the API is actually running

println(VERSION)

using ExportWebAssembly

# Make a single call to warm up
function my_fun(a)
    return 2*a
end

write_js("bleh.js", my_fun, Tuple{Int32}, include_init = true)
