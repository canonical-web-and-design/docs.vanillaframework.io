# docs.vanillaframework.io (legacy)

The current documentation site for Vanilla Framework.

This project will soon be discontinued (hopefully by April 2017), as docs.vanillaframework.io will be hosted by [the docs.ubuntu.com application](https://github.com/ubuntudesign/docs.ubuntu.com).

## Running locally

To run this site:

``` bash
curl https://getcaddy.com/ | bash  # Install caddy server if you don't have it
./build-html  # Build HTML documentation from the vanilla-framework repository
caddy  # Run the server
```

Now browse to <http://127.0.0.1:8543/en/> to view the documentation.

License
---

The content of this project is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-sa/4.0/), and the underlying code used to format and display that content is licensed under the [LGPLv3](http://opensource.org/licenses/lgpl-3.0.html) by [Canonical Ltd](http://www.canonical.com/).

With ♥ from Canonical.
