## Try it:
https://robhilldev.github.io/notes_app/

## For running the app locally:

Since separate JavaScript files loaded as modules are treated as Cross Origin Resource Sharing (CORS) requests by modern browsers, and CORS requests can only be made over HTTP or HTTPS, a local web server will be needed for local development.

#### A python HTTP server can be used for this by opening a terminal at the same folder as index.html and running:
```
python3 -m http.server
```

> If that command yields an error, or `python3 -V` doesn't return a version number, it can be downloaded [here.](https://www.python.org/downloads/) It's worth noting that MacOS and Linux typically come with python pre-installed.

> Any other local web server of choice could also be used.

If the python HTTP server is used it might be necessary to occasionally,
- Restart the server
- Control+F5 refresh (refresh ignoring cache) the page in the browser

Taking these steps will help since the server seems to not always register changes, probably because of some caching issue.

## About the tech stack:

This app consists of vanilla JavaScript, CSS, and HTML.  There are zero dependencies aside from the web server used in local development.  This means no external packages, libraries, frameworks, templating engines, CSS preprocessors, post processors, etc.  The point of a no dependency app was mainly to remember what it was like to build without a giant tangled web of technologies.  Although it's been a fun exercise, and the app feels super responsive without all the bloat, I will likely go back to using the aforementioned external tools in future projects.