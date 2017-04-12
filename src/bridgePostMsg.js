/**
 * 适配不同平台，发起 schema URL
 * @param  {String}   url      发起的 Schema URL
 * @return {undefined}         无返回
 */

export default function(url) {
  if (!url) return

  // 若为 iOS，直接打开地址
  // if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
  //   setTimeout(() => { window.location = url })
  //   return
  // }

  // 若为 Android
  const body = document.body
  let ifr = document.createElement('iframe')
  ifr.style.display = 'none'
  ifr.src = url

  body.appendChild(ifr)

  setTimeout(() => {
    body.removeChild(ifr)
    ifr = null
  }, 1000)
}
