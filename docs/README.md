# GUGU

这里是gugu.js的所有相关文档，因为gugu.js的特殊性质，本部分不像传统的API文档一样，有各种API的罗列，gugu的定位是`静默`、`快速`、`强大`，gugu利用了`野狗云`的实时数据服务，所以本部分主要是说明了数据存储的路径和结构，方便`reducer`的制作。

## 约定

下面所有例子中，有一些专有变量，如下：

* $SCREENID: 表示当前连接用户的Screen Id。

## Log

Log主要存储在`screens/$SCREENID`下，内部结构如下例：

```shell
screens
  $SCREENID
    KdQGSnVv2Qonv4ox60e
      caller: "log@http://10.15.238.22:8080/gugu.js?uuid=test1&o=b:8557:29"
      log
        0: "log1-1"
        1: "log1-2"
    KdQGSnVv2Qonv4ox60f
      caller: "log@http://10.15.238.22:8080/gugu.js?uuid=test1&o=b:8557:29"
      log
        0: "log2-1"
        1: "log2-2"
    ...
```

`screens/$SCREENID`下每个元素都是一次log请求，其中`caller`表示了调用者，`log`是所有`log`元素的`JSON`字符串。

## Command

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

`reducer`程序可以通过监听的`command.response.success`来判断。
