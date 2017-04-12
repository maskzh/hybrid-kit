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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getHybridInfo;
/**
 * 获取版本信息
 * 约定 APP 的 navigator.userAgent 版本包含版本信息：ios/schema/xx.xx.xx
 * @method getHybridInfo
 * @return {Object}      返回平台、schema 和 版本号
 */

function getHybridInfo() {
  var info = {};

  var tmp = navigator.userAgent.match(/\w+\/\w+\/\d+\.\d+\.\d+/g);
  tmp = tmp && tmp.pop();

  if (tmp) {
    tmp = tmp.split('/');
    if (tmp && tmp.length === 3) {
      info.platform = tmp[0];
      info.schema = tmp[1];
      info.version = tmp[1];
    }
  }

  return info;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = requestHybrid;

var _getHybridInfo2 = __webpack_require__(0);

var _getHybridInfo3 = _interopRequireDefault(_getHybridInfo2);

var _getHybridUrl = __webpack_require__(3);

var _getHybridUrl2 = _interopRequireDefault(_getHybridUrl);

var _bridgePostMsg = __webpack_require__(2);

var _bridgePostMsg2 = _interopRequireDefault(_bridgePostMsg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function requestHybrid(options) {
  if (!options.action) throw new Error('action must set!');

  // 获取 Hybrid 信息

  var _getHybridInfo = (0, _getHybridInfo3.default)(),
      _getHybridInfo$schema = _getHybridInfo.schema,
      schema = _getHybridInfo$schema === undefined ? 'hybrid' : _getHybridInfo$schema;

  // 生成唯一执行函数，执行后销毁


  var cbName = schema + '_' + Date.now();

  // 处理有回调的情况
  if (options.callback) {
    (function () {
      var cb = options.callback;
      options.callback = cbName;
      window[cbName] = function (data) {
        try {
          cb(JSON.parse(data));
          delete window[cbName];
        } catch (err) {
          console.error(err);
        }
      };
    })();
  }

  var url = (0, _getHybridUrl2.default)(schema, options);

  (0, _bridgePostMsg2.default)(url);

  return url;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (url) {
  if (!url) return;

  // 若为 iOS，直接打开地址
  // if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
  //   setTimeout(() => { window.location = url })
  //   return
  // }

  // 若为 Android
  var body = document.body;
  var ifr = document.createElement('iframe');
  ifr.style.display = 'none';
  ifr.src = url;

  body.appendChild(ifr);

  setTimeout(function () {
    body.removeChild(ifr);
    ifr = null;
  }, 1000);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = getHybridUrl;
/**
 * 获取发起调用 Hybrid 的 Url
 * @method getHybridUrl
 * @param  {String}     schema  APP 对应的 schema
 * @param  {Object}     options 配置参数
 * @return {String}             转化后地址
 */

function getHybridUrl(schema, options) {
  // 添加了时间戳，防止 URL 不起效
  var url = schema + '://' + options.action + '?t=' + Date.now();

  if (options.callback) {
    url += '&callback=' + options.callback;
  }

  if (options.params) {
    var paramStr = _typeof(options.params) === 'object' ? JSON.stringify(options.params) : options.params;
    url += '&params=' + encodeURIComponent(paramStr);
  }

  return url;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestHybrid = exports.getHybridInfo = undefined;

var _getHybridInfo = __webpack_require__(0);

var _getHybridInfo2 = _interopRequireDefault(_getHybridInfo);

var _requestHybrid = __webpack_require__(1);

var _requestHybrid2 = _interopRequireDefault(_requestHybrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getHybridInfo = _getHybridInfo2.default;
exports.requestHybrid = _requestHybrid2.default;

/***/ })
/******/ ]);
});