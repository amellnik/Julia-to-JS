# Charlotte.jl API

This API does conversions using Charlotte.jl and is written in Julia using HTTP.jl and Joseki.jl.  

## Handy things to run
* Normal use:
 * `docker build -t charlotte .`
 * `docker run --rm -it -p 5000:5000 julia-2-js`
* Debug work:
  * `docker run --rm -it -p 7000:7000 --entrypoint=/bin/bash charlotte`
* Deploying to heroku:
 * `docker tag charlotte registry.heroku.com/charlotte-jl/web`
 * `docker push registry.heroku.com/charlotte-jl/web`
