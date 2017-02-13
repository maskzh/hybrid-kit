/**
 * 获取版本信息
 * 约定 APP 的 navigator.userAgent 版本包含版本信息：ios/schema/xx.xx.xx
 * @method getHybridInfo
 * @return {Object}      返回平台、schema 和 版本号
 */

export default function getHybridInfo() {
  const info = {}

  let tmp = navigator.userAgent.match(/\w+\/\w+\/\d+\.\d+\.\d+/g)
  tmp = tmp && tmp.pop()

  if (tmp) {
    tmp = tmp.split('/')
    if (tmp && tmp.length === 3) {
      info.platform = tmp[0]
      info.schema = tmp[1]
      info.version = tmp[1]
    }
  }

  return info
}
