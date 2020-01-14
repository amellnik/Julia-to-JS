# What's this?

*Note: this project is no longer actively-maintained, and Julia WASM work has advanced significantly since it was put together.  See for example [Keno/julia-wasm](https://github.com/Keno/julia-wasm).*

This repository is a harebrained attempt to create a web application that takes Julia code and converts it to something that can run on the web via either
* Tom Short's [ExportWebAssembly.jl](https://github.com/tshort/ExportWebAssembly.jl), [CodeGen.jl](https://github.com/tshort/CodeGen.jl) and [Emscripten](http://kripken.github.io/emscripten-site/index.html).  
* Mike Innes's [Charlotte.jl](https://github.com/MikeInnes/Charlotte.jl) and the [WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt).

After each tool converts your julia function to either javascript or wasm it loads the result into the browser window so that you can test it out.  This is all very experimental, so don't be surprised when things don't work.

You can try it [here](http://julia2js.gotfork.net/).  Note: this project is now using Heroku's free dynos, so the first request will take up to ~40 seconds extra if no one has used the site in a while.  

## One more thing

The API for the Charlotte.jl conversion is written in [HTTP.jl](https://github.com/JuliaWeb/HTTP.jl) with a bit of help from [Joseki.jl](https://github.com/amellnik/Joseki.jl), and is intended to serve as an example API written entirely in Julia.  
