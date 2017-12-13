# What's this?

This repository is a harebrained attempt to create a web application that takes Julia code, converts it to LLVM bitcode (using Tom Short's [ExportWebAssembly.jl](https://github.com/tshort/ExportWebAssembly.jl)), then uses [Emscripten](http://kripken.github.io/emscripten-site/index.html) to convert it to javascript which you can then test in the browser.  


## Here's the plan

The front-end will present the user with a large textarea input (it would be great if it had syntax highlighting) for a julia script.  The user pastes in something like

```julia
using StaticArrays
struct X
    a::Float64
    b::Float64
end

function fun(a)
    x = SVector(1., 2., a)
    y = SVector(a, a, 3.)
    z = X(a, 2a)
    return sum(x + 2y) - z.b + z.a
end
```

and clicks submit.  This posts the contents of the function to the back-end, which saves it in the container's temporary filesystem.  This file is converted to `.bc` and then to `.js` (eventually `.wasm`), before being incorporated in a webpage which is returned to the user.

## What it does now

Currently it exposes a POST endpoint at `/incomming` that returns the result `.js` as text.

If you want to try this yourself don't forget to run `npm install` in the webserver directory before building the dockerfile.

## Handy things to run
* Normal use:
 * `docker build -t amellnik/jl2js .`
 * `docker run --rm -it -p 5000:5000 amellnik/jl2js`
* Debug work:
 * `docker run --rm -it -v c:/users/alex/documents/julia2js/back-end/work:/wor
k amellnik/jl2js` but with your own path if you want to pass files around (probably need to set entrypoint)
* Deploying to heroku:
 * `docker tag amellnik/julia-2-js registry.heroku.com/julia-2-js/web`
 * `docker push registry.heroku.com/julia-2-js/web`



## TODO:
* Make sure there's no spaces in the string passed for the `Tuple`.  
