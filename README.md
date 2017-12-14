# What's this?

This repository is a harebrained attempt to create a web application that takes Julia code and converts it to Javascript via Tom Short's [ExportWebAssembly.jl](https://github.com/tshort/ExportWebAssembly.jl) and [Emscripten](http://kripken.github.io/emscripten-site/index.html).  You can try it [here](https://alex.mellnik.net/julia-2-js/).    

## Here's the plan

The front-end presents the user with a large textarea input (it would be great if it had syntax highlighting) for a julia script.  The user pastes in something like

```julia
function my_fun(x)
    return (x < 2) ? 1 : my_fun(x-1) + my_fun(x-2)
end
```

and clicks submit.  This posts the contents of the function to the back-end, which saves it in the container's temporary filesystem.  This file is converted to `.bc` and then to `.js` (eventually `.wasm`), before being loaded into the starting webpage.  At that point, you can try out the function to see if it worked (or read a long cryptic error message).

## This is very experimental

Many common operations and functions won't work, but keep an eye on [ExportWebAssembly.jl](https://github.com/tshort/ExportWebAssembly.jl) and [CodeGen.jl](https://github.com/tshort/CodeGen.jl) for updates.  
