# What's this?

This repository contains a Dockerfile for compiling a trivial Julia function to Javascript via Emscripten.  It will be updated with increasingly-complex demonstrations as people figure them out.

The current Dockerfile was developed by Tom Short.  It compiles the function:

```julia
@Base.ccallable Float32 myabs(x::Float32) = abs(x)
```

## Try it out the quick way

Install docker, node and julia.  Run `julia build_and_test.jl`.

## Try it out with more detail

Install docker, then build the image with

```
docker build -t jfs .
```

Run the container to generate build artifacts in `/out`:

```
docker run --rm --mount type=bind,source="$(pwd)"/out,target=/out jfs
```
