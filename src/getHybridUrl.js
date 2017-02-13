/**
 * 获取发起调用 Hybrid 的 Url
 * @method getHybridUrl
 * @param  {String}     schema  APP 对应的 schema
 * @param  {Object}     options 配置参数
 * @return {String}             转化后地址
 */

export default function getHybridUrl(schema, options) {
  // 添加了时间戳，防止 URL 不起效
  let url = `${schema}://${options.action}?t=${Date.now()}`

  if (options.callback) {
    url += `&callback=${options.callback}`
  }

  if (options.params) {
    const paramStr = typeof options.params === 'object'
      ? JSON.stringify(options.params) : options.params
    url += `&params=${encodeURIComponent(paramStr)}`
  }

  return url
}
