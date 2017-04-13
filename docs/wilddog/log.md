# Log 模块

## Path

```javascript
const path = `screens/${SCREENID}`;
```

## Example

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

## Remark

`screens/$SCREENID`下每个元素都是一次log请求，其中`caller`表示了调用者，`log`是所有`log`元素的`JSON`字符串。
