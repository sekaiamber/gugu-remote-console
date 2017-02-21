# remote-console
This is a project that help user debug in mobile end.

## How to use

1. import `remoteConsole.bundle.js` to your project.
```html
<script src="https://sekaiamber.github.io/remote-console/remoteConsole.bundle.js"></script>
```

2. At the beginning of your scripts, set a screen id for your project.
```javascript
window.RC = {
  uuid: 'my-screen'
}
```

3. Access `https://sekaiamber.github.io/remote-console/`, entry your screen id, click `CONNECT`.

4. Then run your project, when `console.log()` executed, you can see logs in this page.

## LICENSE

Copyright 2015-2016 CLEVERIOUS(@sekaiamber)

Released under the MIT and GPL (version 2 or later) Licenses.