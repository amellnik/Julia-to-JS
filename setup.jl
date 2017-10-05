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
