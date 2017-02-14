(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * 适配不同平台，发起 schema URL
 * @param  {String}   url      发起的 Schema URL
 * @return {undefined}         无返回
 */

/* harmony default export */ __webpack_exports__["a"] = function(url) {
  if (!url) return

  // 若为 iOS，直接打开地址
  if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    window.location = url
    return
  }

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
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getHybridInfo;
/**
 * 获取版本信息
 * 约定 APP 的 navigator.userAgent 版本包含版本信息：ios/schema/xx.xx.xx
 * @method getHybridInfo
 * @return {Object}      返回平台、schema 和 版本号
 */

function getHybridInfo() {
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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getHybridUrl;
/**
 * 获取发起调用 Hybrid 的 Url
 * @method getHybridUrl
 * @param  {String}     schema  APP 对应的 schema
 * @param  {Object}     options 配置参数
 * @return {String}             转化后地址
 */

function getHybridUrl(schema, options) {
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


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getHybridInfo__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getHybridUrl__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bridgePostMsg__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["requestHybrid"] = requestHybrid;




window.Hybrid = window.Hybrid || {}

function requestHybrid(options) {
  if(!options.action) throw new Error('action must set!')

  // 获取 Hybrid 信息
  const { schema = 'hybrid' } = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__getHybridInfo__["a" /* default */])()

  // 生成唯一执行函数，执行后销毁
  const cbName = `${schema}_${Date.now()}`

  // 处理有回调的情况
  if (options.callback) {
    const cb = options.callback
    options.callback = cbName
    window.Hybrid[cbName] = function(data) {
      cb(data)
      delete window.Hybrid[cbName]
    }
  }

  const url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__getHybridUrl__["a" /* default */])(schema, options)

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bridgePostMsg__["a" /* default */])(url)

  return url
}


/***/ })
/******/ ]);
});