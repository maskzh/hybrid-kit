# Hybrid

## 一、实现方案
当前 iOS 端用的是 Schema URL，而 Android 端是 JavaScriptCore。二者需要统一。

- Schema URL，主要方案
- JavaScriptCore，备选方案

JavaScriptCore 是更现代的方案，可以直接在 Webview 环境直接注入方法，但可能导致以下的问题
1. 注入时机不唯一（也许是BUG）
2. 刷新页面的时候，JavaScriptCore的注入在不同机型表现不一致，有些就根本不注入了，导致交互失效。

因此一般情况下使用 URL Schema，如果有不满足的场景，使用 JavaScriptCore。

### js 约定
```js
requestHybrid({
  // 请求对象
  action: 'hybridapi',
  // 请求参数，传递给 Native 使用
  params: {},
  // Native处理成功后回调前端的方法
  callback: function (data) {}
})
```
该调用会转换成 Schema URL 或者调用 JavaScriptCore 注入的方法，让 Native 端可以响应。

### Schema URL 约定
```
hybridschema://hybridapi?params=%7B%22data1%22%3A1%2C%22data2%22%3A2%7D&callback=hybrid_1446276509894
```
字段解释：
- hybridschema 为约定 APP 的 schema，例：jkbs
- hybridapi 为发起的 action，由前端和 Native 端定义，例：forward 跳转
- params 为传递的参数，params 的值经过 JSON.stringify 和 encodeURLComponent，例：{ a: 1 } => %7B%22a%22%3A1%7D
- callback 为定义在全局的临时函数的名称，可由 Native 调用执行。

**注意**: 由于 Schema URL 有 2k 的限制，所以 params 会尽可能仅传有用的值，无法传递大量数据。

#### callback 回调约定
`callback: function (data) {}`，Native 端执行回调函数，data 参数格式约定：
```js
{
  result: true,
  data: {},
  message: "success"
}
```
字段解释：
- result 为 action 调用返回结果标志
  - true，代表成功
  - false，代表失败
- data 为 action 调用返回结果数据
- message 为 action 调用返回结果消息，失败时为失败原因


**这里只描述 Schema URL 部分，JavaScriptCore 部分根据后续场景增加，下面为具体 API 和 组件的定义**

## 二、约定 API
### 跳转
跳转是非常重要的 API，跳转场景描述：
1. 前端页面内跳转，与 Native 无关
2. 前端页面跳转到 Native 界面
3. 前端页面新开 Webview 跳转到前端页面，实现页面动画切换，并且可以暂存页面内容，回退页面无需重新加载。

#### 跳转方式
约定字段名为 **type**。
1. native -- 跳转到 Native 页面
2. html5 -- 新开 Webview 跳转到前端页面


#### 动画约定
使用 Native 跳转有更好的体验，其中一个原因就是有过场动画。约定字段名为 **animationType**。
1. push -- 从右推入（默认动画）
2. pop -- 从下推入
3. none -- 无动画

#### action 约定
即 HybridApi
1. go 前往页面
  ```js
  requestHybrid({
    action: 'go', // action
    params: {
      to: 'home', // 要前往的页面
      type: 'native', // 跳转方式
      otherkey: '1', // 其他参数
    }
  })
  ```
  转化为对应的 Schema URL 为
  ```
  schema://go?params=%7B%22to%22%3A%22home%22%2C%22type%22%3A%22native%22%2C%22otherkey%22%3A%221%22%7D
  ```
2. back 后退
  ```js
  requestHybrid({
    action: 'back'
  })
  ```
  转化为对应的 Schema URL 为
  ```
  schema://back
  ```
  **注意** back 的实现，首先在 webview 中检查 history 的记录，如果大于 1 则后退，否则退回上一层。
3. replace 前往页面并销毁当前页面
  ```js
  requestHybrid({
    action: 'replace', // action
    params: {
      to: 'home', // 要前往的页面
      type: 'native', // 跳转方式
      otherkey: '1', // 其他参数
    }
  })
  ```
  转化为对应的 Schema URL 为
  ```
  schema://replace?params=%7B%22to%22%3A%22home%22%2C%22type%22%3A%22native%22%2C%22otherkey%22%3A%221%22%7D
  ```

### Header
Header 组件是非常重要的组件。
场景：前端页面仅仅存在于 Header 以下的空间，但需要能对 Header 进行控制，比如标题，右侧放置分享按钮，筛选按钮，能极大提供功能性和页面空间利用性。

Header 组件所需要的功能：
- header左侧与右侧可配置，显示为文字或者图标（这里要求header实现主流图标，并且也可由业务控制图标），并需要控制其点击回调
- header 的 title 可设置为单标题或者主标题、子标题类型
- 满足一些特殊配置，比如标签类 header

**注意**
- Native 以及前端需对特殊 action 的标识做默认回调，如果未注册 callback，或者点击回调 callback 无返回则执行默认方法
- back 前端默认执行 History.back，如果不可后退则回到指定 URL，Native 如果检测到不可后退则返回 Naive 大首页

Header 组件可以对三块区域进行配置：
- left 左侧，数组，可以放置多个图标
- right 右侧，数组，可以放置多个图标
- title 中间

约定 action:
- updateHeader
  ```js
  requestHybrid({
    action: 'updateHeader',
    params: {
      left: [{
        action: 'back',
        // native 提供常用图标 icon 映射，也可以直接传 http://img.作为图标
        icon: 'back',
        value: '回退', // 如果 value 字段不为空，则使用 value，不使用icon
        callback: function () { } // 点击回调
      }],
      right: [{
        action: 'search',
        callback: function () { }
      }, {
        action: 'me',
        icon: 'http://img', //自定义图标
        callback: function () { }
      }],
      title: 'title',
      title: ['title', 'subtitle'], // 显示主标题，子标题的场景
    }
  })
  ```
- showHeader
  ```js
  requestHybrid({
    action: 'showHeader'
  })
  ```
- hideHeader
  ```js
  requestHybrid({
    action: 'hideHeader'
  })
  ```
- updateHeaderTitle
  ```js
  requestHybrid({
    action: 'updateHeaderTitle',
    params: {
      title: '万家康乐商城'
    }
  })
  ```


### webview 下拉刷新
下拉刷新是非常重要的 API
场景：以新开 webview 的方式加载前端页面，页面在用户操作的过程中无法得到刷新。前端下拉刷新非常受制于 webview 的性能。
约定：**headerRefresh** 、**showHeaderRefresh** 、**hideHeaderRefresh**

**注意** 这里的下拉刷新是前端不可控制的，前端在页面加载时便调用以下方法，注册了下拉时的回调。APP 在发生下拉刷新时执行回调。并在前端主动调用隐藏下拉时，隐藏下拉。
```js
// 页面加载完注册发生下拉刷新时的回调
requestHybrid({
  action: 'headerRefresh',
  params: {
    title: '123' // 刷新时显示的文字
  },
  // 下拉后执行的回调,就全部刷新
  callback: function(data) {
    location.reload(); // 前端直接刷新，或者发起请求更新
  }
});
// 主动显示下拉刷新组件
requestHybrid({
  action: 'showHeaderRefresh'
});
// 主动隐藏下拉刷新组件
requestHybrid({
  action: 'hideHeaderRefresh'
});
```

以下又定义了两个 action，用于 webview 的 **自动刷新**
约定： **onWebviewShow** 和 **onWebviewHide**

Native 端分别在 webview 显示 和 隐藏 时执行回调

```js
// 注册页面加载事件
requestHybrid({
  action: 'onWebviewShow',
  callback: function () {}
});

// 注册页面隐藏事件
requestHybrid({
  action: 'onWebviewHide',
  callback: function () {
    scope.loopFlag = false
    clearTimeout(scope.t)
  }
});
```

### Loading 组件
场景：Native 生成加载 Webview 时，需要显示 Native 的 Loading，并在 webview 加载完毕后由前端隐藏。（目前 Native 隐藏 Loading 的时机不对，造成 Native 的 Loading 结束之后还会白屏一段时间）
约定：**showLoading** 和 **hideLoading**

```js
// 主动显示 Native 的 Loading
requestHybrid({
  action: 'showLoading'
});
// 主动隐藏 Native 的 Loading
requestHybrid({
  action: 'hideLoading'
});
```

### 获取网络状态
场景：前端页面含有大量的图片，获取网络状态有助于前端设置图片后缀，加载不同清晰度的图片，加快页面访问。
约定：**getNetwork**
```js
requestHybrid({
  action: 'getNetwork', // action
  callback: function(data) {
    var data = data.networkType // 返回网络类型 2g，3g，4g，wifi, none
  }
})
```

### 获取地理位置
场景：不同地理位置有不同的运费价格
约定：**getLocation**
```js
requestHybrid({
  action: 'getLocation', // action
  callback: function(data) {
    var lat = data.lat // 纬度
    var lon = data.lon // 经度
  }
})
```

### 获取登录用户信息
场景：登录操作是在 Native 端，而前端页面有需要展示或者使用当前登录用户信息
约定：**getUserInfo**
```js
requestHybrid({
  action: 'getUserInfo', // action
  callback: function(data) {
    var user = data // 包含用户姓名，手机号，token 之类
  }
})
```

### 拍照或从手机相册中选图
场景：在页面上选择并显示本地设备上的图片，并能压缩
约定：**chooseImage**
```js
requestHybrid({
  action: 'chooseImage', // action
  params: {
    count: 1,                             // 默认 1
    sizeType: ['original', 'compressed'], // 原图还是压缩图，默认二者都有,
    sourceType: ['album', 'camera'],      // 相册还是相机，默认二者都有
  },
  callback: function(data) {
    var localIds = data.localIds  // 返回选定照片的本地 ID 列表，localId 可以作为 img 标签的 src 属性显示图片
  }
})
```

### 预览图片
场景：对图片进行大图预览，Native 可以遮盖住 statusBar 和 Header 来进行全屏幕的预览，也能带来更好的滑动放大缩小图片的性能。
约定：**previewImage**
```js
requestHybrid({
  action: 'previewImage', // action
  params: {
    current: '', // 当前显示图片的http链接
    urls: [],  // 需要预览的图片 http 链接列表
  }
})
```

### 上传图片
场景：当选择了压缩图或者原图之后，需要将图片上传图片服务器。
约定：**uploadImage**
```js
requestHybrid({
  action: 'uploadImage', // action
  params: {
    localId: '', // 需要上传的图片的本地ID，从 chooseImage 获得
    process: 1,  // 默认为 1，显示进度提示
  },
  callback: function(data) {
    var key = data.key; // 返回图片的服务器端ID
    var cloud_pic = data.cloud_pic;
  }
})
```

### 分享
场景：分享商品或者文案到微信、QQ。
约定：**share**
```js
requestHybrid({
  action: 'share', // action
  params: {
    // 上面两个参数用于内部分享，或者分享打点
    type: 'product', // 分享类型
    id: '11',        // 分享东西的 ID

    title: '阿娇',   // 标题
    pic: 'http://img.jkbsimg.com/fefe', // 图片
    desc: '呵呵呵呵',   // 描述
    url: 'http://api.jkbsapp.com/h5/#!/product/447/share',  // 分享的地址
  }
})
```

### 搜索框、日期选择、区域选择和其他公共业务组件
Native 的组件可以遮盖住 Header，并有更好的触摸、手势和滚动的性能，这些依照业务定制。
```js
requestHybrid({
  action: 'search', // action
  params: {
    placeholder: '根据名称、生产厂家搜索'
  },
  callback: function(data) {
    console.log(data) // 用户输入的值
  }
})
```
```js
requestHybrid({
  action: 'datePicker', // action
  params: {
    type: 'date' // 日期、时间、日期 + 时间
  },
  callback: function(data) {
    console.log(data) // 日期
  }
})
```