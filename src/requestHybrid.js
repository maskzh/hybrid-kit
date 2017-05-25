import getHybridUrl from './getHybridUrl'
import getHybridInfo from './getHybridInfo'
import getHybridCallback from './getHybridCallback'
import bridgePostMsg from './bridgePostMsg'

export default function requestHybrid(options) {
  if(!options.action) throw new Error('action must set!')

  const schema = options.schema || getHybridInfo().schema || 'hybrid'

  // 处理有回调的情况
  if (options.callback) {
    const cb = options.callback
    options.callback = getHybridCallback(cb)
  }

  const url = getHybridUrl(schema, options)

  bridgePostMsg(url)

  return url
}
