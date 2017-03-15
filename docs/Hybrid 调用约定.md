# Hybrid 调用约定

#### JS 调用
```javascript
requestHybrid({
  // 请求对象
  action: 'hybridapi',
  // 请求参数，传递给 Native 使用
  params: {},
  // Native处理成功后回调前端的方法
  callback: function (data) {}
})
```
#### Native 端接收
```
hybridschema://hybridapi?params=%7B%22data1%22%3A1%2C%22data2%22%3A2%7D&callback=hybrid_1446276509894
```
字段解释：

* hybridschema 为约定 APP 的 schema，例：jkbs
* hybridapi 为发起的 action，由前端和 Native 端定义，例：forward 跳转
* params 为传递的参数，params 的值经过 JSON.stringify 和 encodeURLComponent，例：{ a: 1 } => %7B%22a%22%3A1%7D
* callback 为定义在全局的临时函数的名称，可由 Native 调用执行。

**注意**: 由于 Schema URL 有 2k 的限制，所以 params 会尽可能仅传有用的值，无法传递大量数据。




