# This file does a bunch of julia package setup stuff to make things run faster when the API is actually running

println(VERSION)

using ExportWebAssembly

# Make a single call to warm up
function unlikely_named_fn(a)
    return 2*a
end

write_js("unlikely_named_fn.js", unlikely_named_fn, Tuple{Int}, include_init = false, libdir="/libs")

write_js("unlikely_named_fn.html", unlikely_named_fn, Tuple{Int}, include_init = false, libdir="/libs")

# Probably want this to just generate the WASM and keep the glue code seperately at some point...
write_js("unlikely_named_fn.wasm.js", unlikely_named_fn, Tuple{Int}, include_init = true, libdir="/libs", flavor = :wasm, emcc_args = "-s WASM=1")
