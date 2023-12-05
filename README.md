## Try it:
https://robhilldev.github.io/notes_app/

## For running the app locally:

Since seperate JavaScript files loaded as modules are treated as Cross Origin Resource Sharing (CORS) requests by modern browsers, and CORS requests can only be made over HTTP or HTTPS, a local web server will be needed for local development.

#### A python HTTP server can be used for this by opening a terminal at the same folder as index.html and running:
```
python3 -m http.server
```

> If that command yields an error, or `python3 -V` does not return a version number, it can be downloaded [here.](https://www.python.org/downloads/) It is worth noting that MacOS and Linux typically come with python preinstalled.

> Any other local web server of choice could also be used.
