# 野狗云Store结构

本项目当前使用野狗云的实时通信服务，根据设计([#32](https://github.com/sekaiamber/gugu-remote-console/issues/32))，我们希望做到数据存储通信和整体功能分离，所以将所有存储和通信分离了出来。

## Store

`Store`类将在gugu实例化的时候实例化，并作为`gugu.store`存在，所有模块的`remoteConsole.store`均将指向这个实例。

### 接口API

* get(key: string) => any

这个接口将可以从store中取出`key`对应的数据。

* set(key: string, value: any) => void

这个接口可以设置一个键值对到store。

* registerWriter(key: string, initData: any, conf: object) => void

这个接口将注册一个写入机到store，这个写入机将控制`set`的行为方式，具体可以在`conf`中配置。

* addListener(key: string, method: string, callback: (value: any) => void) => void

这个接口将对某个键进行监听，当数据产生特定事件的时候调用回调函数。

* onChange(key: string, callback: (value: any) => void) => void

这个接口是对`addListener`的包装，传入特定的`method`，当制定键值数据变动的时候调用回调。

### 注册写入配置

`registerWriter`函数接收`conf`参数，这个参数结构如下：

```javascript
const conf = {
  clean: false, // 是否在初始化以后清空之前的数据
  compare: true, // 是否对传入数据和之前的数据进行比较，默认进行比较，若相等则不发送数据
  encode: true, // 是否在发送前对数据进行JSON编码
  interval: 0, // 最小发送间隔
  beforeSend: (data: any, encodeData: any) => sendData: any, // 发送之前是否对预发送数据进行处理，默认情况下，若`encode`为`true`，则发送`encodeData`，否则发送`data`
}
```

若使用store连接修饰器，则可多加一个`initData`参数来确定初始化值。
