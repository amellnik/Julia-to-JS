# This file does a bunch of julia package setup stuff to make things run faster when the API is actually running

println(VERSION)

using ExportWebAssembly

# Make a single call to warm up
function fib(n)
    n < 2 ? 1 : fib(n-1) + fib(n-2)
end

write_js("bleh.js", fib, Tuple{Int32}, include_init = true)
