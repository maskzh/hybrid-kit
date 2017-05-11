/**
 * 获取发起调用 Hybrid 的 callback
 * @method getHybridCallback
 * @param  {String}     schema  APP 对应的 schema
 * @param  {Object}     options 配置参数
 * @return {String}             转化后地址
 */

export default function getHybridCallback(schema, cb) {
  if (!cb || typeof cb !== 'function') throw new Error('cb must set!')

  // 生成唯一执行函数，执行后销毁
  const cbName = `${schema}_${Date.now()}`

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
