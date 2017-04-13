# Command 模块

## Path

```javascript
const path = `commands/${SCREENID}`;
```

## Example

可以通过gugu来远程执行一些代码，通过gugu.js在客户端接受代码的路径如下：

```shell
commands
  $SCREENID
    command
      data: "a = 1"
      id: "1490861404837_11"
    response
      data: "1"
      id: "1490861404837_11"
      success: true
```

正常情况下，当`command`字段变动时，gugu将执行`command.data`中的代码，并把结果存入`command.response`字段中，`reducer`程序需要去监听这个字段的变化获得执行结果。

当执行的代码存在错误或者抛出异常时，gugu将会捕获并分析错误，并将错误返回，如下例：

```shell
commands
  $SCREENID
    command
      data: "a = 1;\na.a.a()"
      id: "1490861404837_11"
    response
      data
        message: "undefined is not an object (evaluating 'a.a')"
        stack: "..."
        columnNumber: 4
        lineNumber: 2
      id: "1490861404837_11"
      success: false
```

## Remark

* `reducer`程序可以通过监听的`command.response.success`来判断远端执行是否成功，若出现错误，可以通过`stack`、`columnNumber`、`lineNumber`来定位错误。
* 正常情况下，`response.data`返回的是JSON字符串。
