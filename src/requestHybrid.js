import getHybridInfo from './getHybridInfo'
import getHybridUrl from './getHybridUrl'
import bridgePostMsg from './bridgePostMsg'

export default function requestHybrid(options) {
  if(!options.action) throw new Error('action must set!')

  // 获取 Hybrid 信息
  const { schema = 'hybrid' } = getHybridInfo()

  // 生成唯一执行函数，执行后销毁
  const cbName = `${schema}_${Date.now()}`

  // 处理有回调的情况
  if (options.callback) {
    const cb = options.callback
    options.callback = cbName
    window[cbName] = function(data) {
      cb(JSON.parse(data))
      delete window[cbName]
    }
  }

  const url = getHybridUrl(schema, options)

  bridgePostMsg(url)

  return url
}
