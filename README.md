# GUGU
This is a project that help user debug in mobile end. It carry `console.log`'s log to an remote page, so that user can see logs in that page.

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

3. Then run your project, when `console.log()` executed, you can see logs in this page.

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

Copyright 2015-2016 CLEVERIOUS(@sekaiamber)

Released under the MIT and GPL (version 2 or later) Licenses.