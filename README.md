# GUGU
This is a project that help user debug in mobile end.

Its name is `GUGU`, which is the nickname of the famous MMORPG game `World of Warcraft`'s character Druid(Moonkin form).

Like this:
![gugu](https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3431954863,1945330254&fm=116&gp=0.jpg)

Moonkin form enables Druids to control hurricane and lightning, we wish our project can like a Moonkin Druid, fast and powerful.

## How to use

1. import `gugu.js` to your project **with the screen id in the query string of the url**.
```html
<script src="https://sekaiamber.github.io/gugu-remote-console/gugu.js?uuid=YOUR-SCREEN-ID"></script>
```

2. Access `https://sekaiamber.github.io/gugu-remote-console/`, entry your screen id(e.g., YOUR-SCREEN-ID), click `CONNECT`.

3. Then run your project, and enjoy :)

## Features

* Select DOM element in remote end, get element details in debug page, include style, box model, path structure, even change styles.
* Get console output in debug page.
* Send and run console command to remote page, with total error feedback.
* Get all network activities in debug page, include request and response informations.
* Get remote end device informations.
* Detect remote end device features.

## Develop

1. run `npm run dev`, you can get test page at `http://localhost:8080/test.html`, and remote page at `http://localhost:8080/remote.html`, the test screen id is `test1`.

## Test

```shell
$ npm run test
```

## Deploy

```shell
$ npm run deploy
```

Get files in `dist/`.

## LICENSE

Copyright 2015-2018 KUCHAIN(@sekaiamber)

Released under the MIT and GPL (version 2 or later) Licenses.