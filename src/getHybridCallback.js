/**
 * 获取发起调用 Hybrid 的 callback
 * @method getHybridCallback
 * @param  {Function}     cb 回调函数
 * @return {String}          函数名称
 */

export default function getHybridCallback(cb) {
  if (!cb || typeof cb !== 'function') throw new Error('cb must set!')

  // 生成唯一执行函数，执行后销毁
  const cbName = `callback_${Date.now()}`

  window[cbName] = function(data) {
    try {
      cb(JSON.parse(data))
      delete window[cbName]
    } catch(err) {
      console.error(err)
    }
  }

  return cbName
}
