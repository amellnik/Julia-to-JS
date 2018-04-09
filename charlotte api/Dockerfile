# Start with 0.6.2 which is also latest at the time of writing
FROM julia:0.6.2

# Make package folder and install everything in require
ENV JULIA_PKGDIR=/opt/julia
RUN julia -e "Pkg.init()"

# Make sure things work when not running as root
RUN useradd -ms /bin/bash myuser
RUN chown -R myuser:myuser /opt/julia
USER myuser


COPY REQUIRE /opt/julia/v0.6/REQUIRE
RUN julia -e "Pkg.resolve()"

# Get a bunch of packages not in metadata
RUN julia -e 'Pkg.clone("https://github.com/amellnik/Joseki.jl.git")' \
&& julia -e 'Pkg.clone("https://github.com/tshort/WebAssembly.jl.git"); Pkg.checkout("WebAssembly", "invoke")' \
&& julia -e 'Pkg.clone("https://github.com/tshort/Charlotte.jl.git"); Pkg.checkout("Charlotte", "invoke")'

COPY charlotte_server.jl /

CMD julia charlotte_server.jl
