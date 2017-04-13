# Feature 模块

## Path

```javascript
const path = `features/${SCREENID}`;
```

## Example

```shell
features
  $SCREENID: "1110111011111101111101111"
```

`feature`字符串代表了gugu内部对于远端设备支持功能的一个嗅探，`1`表示支持某个功能，`0`则表示不支持。

## Remark

这个功能列表及顺序，将维护在`lib/constants/features.json`文件中。
