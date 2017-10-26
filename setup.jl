# This file does a bunch of julia package setup stuff

Pkg.init()
packages = ["StaticArrays", "LLVM"]
Pkg.add.(packages)

Pkg.clone("https://github.com/tshort/ExportWebAssembly.jl")
# Use every package once to force precompilation
for p in packages
    eval(parse(string("using ", p)))
end
using ExportWebAssembly

# Make a single call to warm up
using StaticArrays
struct X
    a::Float64
    b::Float64
end

function unlikely_named_fn(a)
    x = SVector(1., 2., a)
    y = SVector(a, a, 3.)
    z = X(a, 2a)
    return sum(x + 2y) - z.b + z.a
end

export_bitcode("unlikely_named_fn.bc", unlikely_named_fn, [Float32])

# Also call emscripten once
