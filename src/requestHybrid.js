import getHybridInfo from './getHybridInfo'
import getHybridUrl from './getHybridUrl'
import getHybridCallback from './getHybridCallback'
import bridgePostMsg from './bridgePostMsg'

export default function requestHybrid(options) {
  if(!options.action) throw new Error('action must set!')

  // 获取 Hybrid 信息
  const { schema = 'hybrid' } = getHybridInfo()

  // 处理有回调的情况
  if (options.callback) {
    const cb = options.callback
    options.callback = getHybridCallback(schema, cb)
  }

  const url = getHybridUrl(schema, options)

  bridgePostMsg(url)

  return url
}
