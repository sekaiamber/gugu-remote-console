# 功能模块结构

gugu的功能模块被设计为跟通信分离([#32](https://github.com/sekaiamber/gugu-remote-console/issues/32))。

## 基础类 `baseModule.js`

基础类的设计遵循[#30](https://github.com/sekaiamber/gugu-remote-console/issues/30)，他包装了一些最基本的函数和构造器。

在gugu里，原则上，不需要派生模块写自己的`constructor`。

基础类的构造器内制定了模块的生命周期：

* 绑定gugu，即`RemoteConsole`类。
* 执行`connectStore()`函数，连接Store。
* 执行`init()`函数。
* 若存在`update()`函数，则执行，并根据`updateInterval`参数每隔固定时间执行`update()`函数。

派生的模块可以重写基础类的`connectStore`、`init`和`update`函数。

### 成员变量

* remoteConsole: RemoteConsole

这个变量是挂载这个模块的gugu实例的引用。

* store: Store

这个变量是`remoteConsole.store`的引用。

* inited: Boolean

这个变量在`init`函数执行完成后置`true`。

* updateInterval: Number

这个变量代表了`update`函数运行的周期，单位毫秒。必须是大于0的整数。

### 成员函数

* connectStore() => void (可重写)

这个函数专门用来放置连接Store，和注册写入的过程的函数，它将在`init`函数执行之前执行，这样可以使得在`init`函数中可以进行一些数据操作。

* init() => void (可重写)

这个函数专门用来放置模块初始化的一些代码，包括设置一些生命周期中有用的一些配置。

* update() => void (可重写)

这个函数专门用来放置在整个监控过程中需要反复定时执行的一些代码，它可以通过`updateInterval`来控制间隔，并且若它存在，那么则至少在`init`函数执行完之后执行一次。

* getData(key: string) => any

这个函数接受一个`key`，并从`store`中获取对应`value`。

* setData(key: string, value: any) => void

这个函数接受一对键值，并赋值到`store`中，注意：*只有当这个键是本模块注册的时候才能写入*。

* onDataChange(key: string, callback: (value: any) => void) => void

这个函数将在`store`上对于`key`创建一个监听。当对应`value`变动时调用`callback`。

## 连接Store

模块需要在`connectStore`中完成连接Store的工作，这里提供了连接修饰器。

### 连接器 `connectStore.js`

`connectStore`提供了配置化连接Store的方式，它将为模块自动生成`connectStore`函数，这意味着开发者不需要去重写这个函数，用法如下：

```javascript
import connectStore from 'path/to/connectStore.js';

const storeConfig = ...;

@connectStore(storeConfig)
export default class YourModule extends BaseModule {
  // ...
}
```

`storeConfig`的结构如下：

```javascript
const storeConfig = {
  writer: {
    key1: {
      initData: any,
      clean: boolean,
      compare: boolean,
      encode: boolean,
      beforeSend: (data, encodeData) => data,
    }
    ...
  }
}
```

相关配置作用可以在Store文档中找到。
