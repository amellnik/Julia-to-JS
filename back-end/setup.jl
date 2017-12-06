# # This file does a bunch of julia package setup stuff

println(VERSION)

using ExportWebAssembly

# Make a single call to warm up
function unlikely_named_fn(a)
    return 2*a
end

# export_bitcode("unlikely_named_fn.bc", unlikely_named_fn, [Float32])

write_js("unlikely_named_fn.js", unlikely_named_fn, Tuple{Int}, include_init = false, libdir="/libs")

# Not sure what this is doing at the moment...
write_js("unlikely_named_fn.wasm", unlikely_named_fn, Tuple{Int}, include_init = true, libdir="/libs", flavor = :wasm, emcc_args = "-s WASM=1")
