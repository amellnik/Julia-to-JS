using Charlotte, HTTP, Joseki, JSON

# A helpful function from this StackOverflow answer: https://stackoverflow.com/questions/46364922/how-to-parse-multiline-string-in-julia
function parseall(str)
    pos = start(str)
    exs = []
    while !done(str, pos)
        ex, pos = parse(str, pos) # returns next starting point as well as expr
        ex.head == :toplevel ? append!(exs, ex.args) : push!(exs, ex) #see comments for info
    end
    if length(exs) == 0
        throw(ParseError("end of input"))
    elseif length(exs) == 1
        return exs[1]
    else
        return Expr(:block, exs...) # convert the array of expressions
                                    # back to a single expression
    end
end

# Define our endpoint
function towasm(req::HTTP.Request)
    # Make sure we have the inputs we are expecting
    j = try
        body_as_dict(req)
    catch err
        return error_responder(req, "I was expecting a json request body!")
    end
    if !(haskey(j, "definition") & haskey(j, "function") & haskey(j, "types"))
        return error_responder(req, "You need to provide both a function definition and call")
    end

    # How about some sanitization here?
    try
        eval(parseall(HTTP.URIs.unescapeuri(j["definition"])))
    catch err
        return error_responder(req, string("Error parsing your function definition: ", err))
    end
    fn = eval(parse(HTTP.URIs.unescapeuri(j["function"])))
    types = try
        eval(parse(HTTP.URIs.unescapeuri(j["types"])))
    catch err
        return error_responder(req, string("Error parsing your function argument types: ", err))
    end

    # Try to generate wasm and if it doesn't work customize the error message
    gen_mod = try
        wasm_module([fn => types])
    catch err
        return error_responder(req, string("Error generating wasm: ", err))
    end

    # We generated wasm, respond with a url-escaped
    json_responder(req, HTTP.URIs.escapeuri(string(gen_mod)))
end

# TODO: is CORS enabled by default?

# Define middleware stack and register one route
router = HTTP.Router()
mw = Joseki.default_middleware
HTTP.register!(router, "POST", "/convert",
    stack(mw, towasm; error_fn=Joseki.error_responder))
HTTP.register!(router, "OPTIONS", "*",
    stack(mw, req -> req.response; error_fn=Joseki.error_responder))

# Fire up the server
s = HTTP.Servers.Server(router)
p = haskey(ENV, "PORT") ? ENV["PORT"] : 7000
HTTP.serve(s, ip"127.0.0.1", p; verbose=false)
