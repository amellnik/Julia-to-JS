FROM amellnik/codegen-wasm

# Custom stuff for web integration
RUN ln -s nodejs /usr/bin/node

# Install additional Julia libraries we want to let people test here?

# For some reason we need to run julia from within this folder in order to get ExportWebAssembly to work right
COPY /webserver /webserver

# Is this really necessary?  Probably not.  
RUN julia /webserver/warm-up.jl

ENV JULIA_PKGDIR=/packages

# RUN useradd -ms /bin/bash rando

RUN mkdir /packages \
 && cp -R /root/.julia/v0.7/. /packages \
 && chmod -R a+rwx /packages \
 && cp ~/.emscripten / \
 && chmod a+rwx /.emscripten

# USER rando

# After the container starts, the current user needs to copy
# /.emscripten to ~/ -- this is why we now use a starup script
# rather than running node directly.

 CMD /bin/bash /webserver/startup.sh
