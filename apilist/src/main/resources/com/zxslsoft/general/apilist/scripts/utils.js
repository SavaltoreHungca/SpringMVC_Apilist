(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.Utils = {}));
}(this, (function (exports) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _typeof_1 = createCommonjsModule(function (module) {
	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    module.exports = _typeof = function _typeof(obj) {
	      return typeof obj;
	    };
	  } else {
	    module.exports = _typeof = function _typeof(obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	module.exports = _typeof;
	});

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	var arrayWithHoles = _arrayWithHoles;

	function _iterableToArrayLimit(arr, i) {
	  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	var iterableToArrayLimit = _iterableToArrayLimit;

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) {
	    arr2[i] = arr[i];
	  }

	  return arr2;
	}

	var arrayLikeToArray = _arrayLikeToArray;

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
	}

	var unsupportedIterableToArray = _unsupportedIterableToArray;

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	var nonIterableRest = _nonIterableRest;

	function _slicedToArray(arr, i) {
	  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
	}

	var slicedToArray = _slicedToArray;

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var classCallCheck = _classCallCheck;

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	var createClass = _createClass;

	var rngBrowser = createCommonjsModule(function (module) {
	// Unique ID creation requires a high quality random # generator.  In the
	// browser this is a little complicated due to unknown quality of Math.random()
	// and inconsistent support for the `crypto` API.  We do the best we can via
	// feature-detection

	// getRandomValues needs to be invoked in a context where "this" is a Crypto
	// implementation. Also, find the complete implementation of crypto on IE11.
	var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
	                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

	if (getRandomValues) {
	  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

	  module.exports = function whatwgRNG() {
	    getRandomValues(rnds8);
	    return rnds8;
	  };
	} else {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var rnds = new Array(16);

	  module.exports = function mathRNG() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return rnds;
	  };
	}
	});

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */
	var byteToHex = [];
	for (var i = 0; i < 256; ++i) {
	  byteToHex[i] = (i + 0x100).toString(16).substr(1);
	}

	function bytesToUuid(buf, offset) {
	  var i = offset || 0;
	  var bth = byteToHex;
	  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
	  return ([
	    bth[buf[i++]], bth[buf[i++]],
	    bth[buf[i++]], bth[buf[i++]], '-',
	    bth[buf[i++]], bth[buf[i++]], '-',
	    bth[buf[i++]], bth[buf[i++]], '-',
	    bth[buf[i++]], bth[buf[i++]], '-',
	    bth[buf[i++]], bth[buf[i++]],
	    bth[buf[i++]], bth[buf[i++]],
	    bth[buf[i++]], bth[buf[i++]]
	  ]).join('');
	}

	var bytesToUuid_1 = bytesToUuid;

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	var _nodeId;
	var _clockseq;

	// Previous uuid creation time
	var _lastMSecs = 0;
	var _lastNSecs = 0;

	// See https://github.com/uuidjs/uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};
	  var node = options.node || _nodeId;
	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // node and clockseq need to be initialized to random values if they're not
	  // specified.  We do this lazily to minimize issues related to insufficient
	  // system entropy.  See #189
	  if (node == null || clockseq == null) {
	    var seedBytes = rngBrowser();
	    if (node == null) {
	      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	      node = _nodeId = [
	        seedBytes[0] | 0x01,
	        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
	      ];
	    }
	    if (clockseq == null) {
	      // Per 4.2.2, randomize (14 bit) clockseq
	      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
	    }
	  }

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  for (var n = 0; n < 6; ++n) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : bytesToUuid_1(b);
	}

	var v1_1 = v1;

	function v4(options, buf, offset) {
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options === 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || rngBrowser)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ++ii) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || bytesToUuid_1(rnds);
	}

	var v4_1 = v4;

	var uuid = v4_1;
	uuid.v1 = v1_1;
	uuid.v4 = v4_1;

	var uuid_1 = uuid;

	function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

	function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
	function $(id) {
	  return document.getElementById(id);
	}
	var $$ = /*#__PURE__*/function () {
	  function $$() {
	    classCallCheck(this, $$);
	  }

	  createClass($$, null, [{
	    key: "createStyleSheet",
	    value: function createStyleSheet() {
	      var head = document.head || document.getElementsByTagName('head')[0];
	      var style = document.createElement('style');
	      style.type = 'text/css';
	      head.appendChild(style);
	      return style.sheet || style['styleSheet'];
	    }
	  }, {
	    key: "addStyleSheet",
	    value: function addStyleSheet(selector, rules, index) {
	      // 创建一个 style， 返回其 stylesheet 对象
	      // 注意：IE6/7/8中使用 style.stylesheet，其它浏览器 style.sheet
	      // 创建 stylesheet 对象
	      var sheet = window[this.sheetName] || this.createStyleSheet();

	      if (!window[this.sheetName]) {
	        window[this.sheetName] = sheet;
	      }

	      if (sheet.insertRule) {
	        var rule = selector + "{" + rules + "}";
	        sheet.insertRule(rule, index);
	      } else if (sheet.addRule) {
	        sheet.addRule(selector, rules, index);
	      }
	    }
	  }, {
	    key: "wrapEle",
	    value: function wrapEle(type, element, style) {
	      var ele = element;

	      switch (type) {
	        case 'block':
	          {
	            this.setStyle(ele, {
	              display: 'block',
	              position: 'relative'
	            });
	            break;
	          }

	        case 'inline':
	          {
	            this.setStyle(ele, {
	              display: 'inline-block',
	              position: 'relative'
	            });
	            break;
	          }

	        case 'fixed':
	          {
	            this.setStyle(ele, {
	              display: 'block',
	              position: 'fixed'
	            });
	            break;
	          }

	        case 'absolute':
	          {
	            this.setStyle(ele, {
	              display: 'block',
	              position: 'absolute'
	            });
	            break;
	          }

	        case 'flex':
	          {
	            this.setStyle(ele, {
	              display: 'flex',
	              position: 'relative',
	              overflow: 'hidden',
	              'flex-grow': '1'
	            });
	            break;
	          }

	        case 'flex-item':
	          {
	            this.setStyle(ele, {
	              display: 'block',
	              position: 'relative',
	              'flex-grow': '1'
	            });
	            break;
	          }
	      }

	      if (style) this.setStyle(ele, style);
	      return ele;
	    }
	  }, {
	    key: "creEle",
	    value: function creEle(type, style, tagName) {
	      return this.wrapEle(type, document.createElement(tagName || 'div'), style);
	    }
	  }, {
	    key: "setStyle",
	    value: function setStyle(element, style) {
	      for (var name in style) {
	        switch (name) {
	          case 'top':
	          case 'left':
	          case 'bottom':
	          case 'right':
	          case 'width':
	          case 'height':
	          case 'padding':
	          case 'padding-left':
	          case 'padding-top':
	          case 'padding-right':
	          case 'padding-bottom':
	          case 'min-width':
	          case 'max-width':
	          case 'min-height':
	          case 'max-height':
	            if (typeof style[name] === 'number') {
	              style[name] = style[name] + 'px';
	            }

	            break;
	        }
	      }

	      if (element.style.cssText) {
	        var beforeStyle = this.getInlineCssStyle(element);

	        for (var _name in style) {
	          if (style[_name] === '') {
	            delete beforeStyle[_name];
	          } else {
	            beforeStyle[_name] = style[_name];
	          }
	        }

	        element.style.cssText = this.toCssText(beforeStyle);
	      } else {
	        element.style.cssText = this.toCssText(style);
	      }
	    }
	  }, {
	    key: "toCssText",
	    value: function toCssText(style) {
	      var ans = "";
	      if (!this.isObject(style)) return "";

	      for (var name in style) {
	        ans += name + ':' + style[name] + ';';
	      }

	      return ans;
	    }
	  }, {
	    key: "getInlineCssStyle",
	    value: function getInlineCssStyle(elementOrCssText) {
	      var cssText = typeof elementOrCssText === 'string' ? elementOrCssText : elementOrCssText.style.cssText;
	      var ans = {};

	      if (cssText) {
	        var styles = cssText.split(';').filter(Boolean);

	        var _iterator = _createForOfIteratorHelper(styles),
	            _step;

	        try {
	          for (_iterator.s(); !(_step = _iterator.n()).done;) {
	            var style = _step.value;
	            if (style.trim() === '') continue;

	            var _style$split = style.split(':'),
	                _style$split2 = slicedToArray(_style$split, 2),
	                name = _style$split2[0],
	                value = _style$split2[1];

	            ans[name.trim()] = value.trim();
	          }
	        } catch (err) {
	          _iterator.e(err);
	        } finally {
	          _iterator.f();
	        }
	      }

	      return ans;
	    }
	  }, {
	    key: "removeStyle",
	    value: function removeStyle(ele) {
	      var style = this.getInlineCssStyle(ele);

	      for (var _len = arguments.length, names = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        names[_key - 1] = arguments[_key];
	      }

	      for (var _i = 0, _names = names; _i < _names.length; _i++) {
	        var name = _names[_i];
	        delete style[name];
	      }

	      ele.style.cssText = this.toCssText(style);
	      return style;
	    }
	  }, {
	    key: "getElementInfoBatch",
	    value: function getElementInfoBatch(consumer) {
	      var infos = new Array();

	      for (var _len2 = arguments.length, elements = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        elements[_key2 - 1] = arguments[_key2];
	      }

	      for (var _i2 = 0, _elements = elements; _i2 < _elements.length; _i2++) {
	        var elemnt = _elements[_i2];
	        infos.push(this.getElementInfo(elemnt));
	      }

	      consumer.apply(void 0, infos);
	    }
	  }, {
	    key: "getElementInfo",
	    value: function getElementInfo(element, consumer) {
	      var ans = {
	        width: element.offsetWidth,
	        height: element.offsetHeight,
	        top: element.offsetTop,
	        left: element.offsetLeft,
	        innerWidth: element.offsetWidth,
	        innerHeight: element.offsetHeight,
	        innerTop: 0,
	        innerLeft: 0
	      };

	      if (element.style.borderLeftWidth) {
	        ans.innerWidth -= parseInt(element.style.borderLeftWidth);
	      }

	      if (element.style.borderRightWidth) {
	        ans.innerWidth -= parseInt(element.style.borderRightWidth);
	      }

	      if (element.style.borderTopWidth) {
	        ans.innerHeight -= parseInt(element.style.borderTopWidth);
	      }

	      if (element.style.borderBottomWidth) {
	        ans.innerHeight -= parseInt(element.style.borderBottomWidth);
	      }

	      if (element.style.paddingLeft) {
	        ans.innerWidth -= parseInt(element.style.paddingLeft);
	        ans.innerLeft += parseInt(element.style.paddingLeft);

	        if (element.style.boxSizing === 'boder-box') {
	          ans.innerLeft += parseInt(element.style.borderLeftWidth);
	        }
	      }

	      if (element.style.paddingRight) {
	        ans.innerWidth -= parseInt(element.style.paddingRight);
	      }

	      if (element.style.paddingTop) {
	        ans.innerHeight -= parseInt(element.style.paddingTop);
	        ans.innerTop += parseInt(element.style.paddingTop);

	        if (element.style.boxSizing === 'boder-box') {
	          ans.innerTop += parseInt(element.style.borderTopWidth);
	        }
	      }

	      if (element.style.paddingBottom) {
	        ans.innerHeight -= parseInt(element.style.paddingBottom);
	      }

	      if (consumer) {
	        consumer(ans);
	      }

	      return ans;
	    }
	  }, {
	    key: "isObject",
	    value: function isObject(obj) {
	      return !this.isUndfined(obj) && !this.isArray(obj) && _typeof_1(obj) === 'object';
	    }
	  }, {
	    key: "isEmptyStr",
	    value: function isEmptyStr(str) {
	      return str === "" || this.isUndfined(str);
	    }
	  }, {
	    key: "isUndfined",
	    value: function isUndfined(obj) {
	      return obj === null || typeof obj === 'undefined';
	    }
	  }, {
	    key: "isArray",
	    value: function isArray(obj) {
	      return Array.isArray(obj);
	    }
	  }, {
	    key: "isFunction",
	    value: function isFunction(f) {
	      return typeof f === 'function';
	    }
	  }, {
	    key: "in",
	    value: function _in(obj, array) {
	      for (var name in array) {
	        if (obj === array[name]) {
	          return true;
	        }
	      }

	      return false;
	    }
	  }, {
	    key: "get",
	    value: function get(obj, propName) {
	      return obj[propName];
	    }
	  }, {
	    key: "getMousePositionInElement",
	    value: function getMousePositionInElement(elemt, event) {
	      var clientX = event.clientX,
	          clientY = event.clientY;
	      var eleInfo = this.getElementInfo(elemt);
	      var position = elemt.getBoundingClientRect();
	      var left = clientX - position.x;
	      var top = clientY - position.y;
	      var bottom = eleInfo.innerHeight - top;
	      var right = eleInfo.innerWidth - left;
	      var leaved = left < 0 || top < 0 || bottom < 0 || right < 0;
	      return {
	        left: left,
	        top: top,
	        bottom: bottom,
	        right: right,
	        leaved: leaved
	      };
	    }
	  }, {
	    key: "getComputedStyle",
	    value: function (_getComputedStyle) {
	      function getComputedStyle(_x, _x2) {
	        return _getComputedStyle.apply(this, arguments);
	      }

	      getComputedStyle.toString = function () {
	        return _getComputedStyle.toString();
	      };

	      return getComputedStyle;
	    }(function (node, attr) {
	      if (typeof getComputedStyle != 'undefined') {
	        var value = getComputedStyle(node, null).getPropertyValue(attr);
	        return attr == 'opacity' ? value * 100 : value; //兼容不透明度，如果是不透明度，则返回整数方便计算
	      } else if (typeof this.get(node, "currentStyle") != 'undefined') {
	        if (attr == 'opacity') {
	          //兼容不透明度
	          return Number(this.get(node, "currentStyle").getAttribute('filter').match(/(?:opacity[=:])(\d+)/)[1]);
	        } else {
	          return this.get(node, "currentStyle").getAttribute(attr);
	        }
	      }
	    })
	  }, {
	    key: "getStrPx",
	    value: function getStrPx(str, container) {
	      var _span$parentElement;

	      var span = window.document.createElement("span");
	      span.innerText = str;
	      this.setStyle(span, {
	        "position": "fixed",
	        "top": "0",
	        "left": "0",
	        "white-space": "pre",
	        "z-index": "-9999",
	        "visibility": "hidden",
	        "display": "inline-block",
	        "font": this.getComputedStyle(container, "font"),
	        "font-family": this.getComputedStyle(container, "font-family"),
	        "font-weight": this.getComputedStyle(container, "font-weight"),
	        "font-size": this.getComputedStyle(container, "font-size"),
	        "font-feature-settings": this.getComputedStyle(container, "font-feature-settings"),
	        "line-height": this.getComputedStyle(container, "line-height"),
	        "letter-spacing": this.getComputedStyle(container, "letter-spacing")
	      });
	      window.document.body.append(span);
	      var textWidth = span.clientWidth;
	      var ans = {
	        width: span.clientWidth,
	        height: span.clientHeight
	      };
	      (_span$parentElement = span.parentElement) === null || _span$parentElement === void 0 ? void 0 : _span$parentElement.removeChild(span);
	      return ans;
	    }
	  }, {
	    key: "getRelativePosition",
	    value: function getRelativePosition(elemt, parent) {
	      var originalElement = elemt;
	      var ans = {
	        left: 0,
	        top: 0,
	        right: 0,
	        bottom: 0,
	        rightBoderLeft: 0,
	        bottomBorderLeft: 0
	      };

	      while (elemt !== parent) {
	        ans.left += elemt.offsetLeft;
	        ans.top += elemt.offsetTop;
	        elemt = elemt.offsetParent;
	      }

	      var parentInfo = this.getElementInfo(parent);
	      var elemtInfo = this.getElementInfo(elemt);
	      ans.bottom = parentInfo.innerHeight - ans.top - elemtInfo.height;
	      ans.right = parentInfo.innerWidth - ans.left - elemtInfo.width;
	      var originalElementInfo = this.getElementInfo(originalElement);
	      ans.rightBoderLeft = ans.left + originalElementInfo.width;
	      ans.bottomBorderLeft = ans.top + originalElementInfo.height;
	      return ans;
	    }
	  }, {
	    key: "splitToSuitLength",
	    value: function splitToSuitLength(container, str) {
	      var containerInfo = this.getElementInfo(container);

	      if (str.length === 0 || this.getStrPx(str, container).width <= containerInfo.innerWidth) {
	        return [str, ""];
	      }

	      var critical = str.length / 2;

	      while (true) {
	        var _this$getStrPx = this.getStrPx(str.substring(0, critical), container),
	            width = _this$getStrPx.width;

	        var accuracy = containerInfo.innerWidth - width;

	        if (accuracy >= 0 && accuracy < 10) {
	          return [str.substring(0, critical), str.substring(critical)];
	        }

	        if (width > containerInfo.innerWidth) {
	          critical -= critical / 2;
	        } else if (width < containerInfo.innerWidth) {
	          critical += critical / 2;
	        }
	      }
	    }
	  }, {
	    key: "cancelLastTimeout",
	    value: function cancelLastTimeout(id) {
	      var ids = this.timeoutIdMap.get(id) || [];

	      var _iterator2 = _createForOfIteratorHelper(ids),
	          _step2;

	      try {
	        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	          var i = _step2.value;
	          clearTimeout(i);
	        }
	      } catch (err) {
	        _iterator2.e(err);
	      } finally {
	        _iterator2.f();
	      }

	      this.timeoutIdMap.set(id, []);
	    }
	  }, {
	    key: "setLastTimeout",
	    value: function setLastTimeout(id, func, delay) {
	      this.cancelLastTimeout(id);
	      var ids = this.timeoutIdMap.get(id);

	      if (!ids) {
	        ids = [];
	        this.timeoutIdMap.set(id, ids);
	      }

	      ids.push(window.setTimeout(func, delay));
	    }
	  }, {
	    key: "stopPropagation",
	    value: function stopPropagation(elemt, evtName) {
	      elemt.addEventListener(evtName, function (e) {
	        e.stopPropagation();
	      });
	    }
	  }, {
	    key: "preventDefault",
	    value: function preventDefault(elemt, evtName) {
	      elemt.addEventListener(evtName, function (e) {
	        e.preventDefault();
	      });
	    }
	  }, {
	    key: "addExecuteOneEvt",
	    value: function addExecuteOneEvt(elmt, evtName, listener) {
	      var l = function l(evnt) {
	        elmt.removeEventListener(evtName, l);
	        listener(evnt);
	      };

	      elmt.addEventListener(evtName, l);
	    }
	  }, {
	    key: "addDragEvent",
	    value: function addDragEvent(element, callback) {
	      var _this = this;

	      var dragStateId = uuid_1.v1();
	      this.dragStates.set(dragStateId, {
	        startX: 0,
	        startY: 0,
	        pressed: false,
	        deltaX: 0,
	        deltaY: 0,
	        registered: false,
	        event: undefined
	      });

	      var startResize = function startResize(event) {
	        var dragState = _this.dragStates.get(dragStateId);

	        if (!dragState) throw new Error('Sys error');

	        if (dragState.pressed && !dragState.registered) {
	          dragState.registered = true;
	          document.addEventListener('mousemove', resizing);
	          document.addEventListener('mouseup', resizeDone);
	          document.removeEventListener('mousemove', startResize);
	        }
	      };

	      var resizing = function resizing(event) {
	        var dragState = _this.dragStates.get(dragStateId);

	        if (!dragState) throw new Error('Sys error');

	        if (dragState.pressed && dragState.registered) {
	          dragState.deltaX = event.screenX - dragState.startX;
	          dragState.deltaY = event.screenY - dragState.startY;
	          dragState.startX += dragState.deltaX;
	          dragState.startY += dragState.deltaY;
	          dragState.event = event;
	          callback(dragState);
	        }
	      };

	      var resizeDone = function resizeDone(event) {
	        var dragState = _this.dragStates.get(dragStateId);

	        if (!dragState) throw new Error('Sys error');

	        if (dragState.pressed) {
	          dragState.pressed = false;
	          dragState.registered = false;
	          dragState.event = event;
	          callback(dragState);
	          document.removeEventListener('mousemove', resizing);
	          document.removeEventListener('mouseup', resizeDone);
	          element.removeEventListener('mouseup', resizeDone);
	        }
	      };

	      element.addEventListener('mousedown', function (event) {
	        var dragState = _this.dragStates.get(dragStateId);

	        if (!dragState) throw new Error('Sys error');
	        dragState.startX = event.screenX;
	        dragState.startY = event.screenY;
	        dragState.pressed = true;
	        dragState.registered = false;
	        dragState.event = event;
	        callback(dragState);
	        document.addEventListener('mousemove', startResize);
	        element.addEventListener('mouseup', resizeDone);
	      });
	    }
	  }, {
	    key: "stackPeek",
	    value: function stackPeek(stack) {
	      if (stack.length > 0) {
	        return stack[stack.length - 1];
	      }

	      return undefined;
	    }
	  }, {
	    key: "addClass",
	    value: function addClass(elemt, c) {
	      elemt.className += " " + c;
	    }
	  }, {
	    key: "removeClass",
	    value: function removeClass(elemt, c) {
	      if (elemt.className) {
	        var classNames = elemt.className.split(/\s+/);
	        var newClassName = '';
	        classNames.forEach(function (it) {
	          if (it !== c) {
	            newClassName += ' ' + it;
	          }
	        });
	        elemt.className = newClassName;
	      }
	    }
	  }, {
	    key: "randmonId",
	    value: function randmonId() {
	      return "_" + uuid_1.v1().replace(/-/g, '');
	    }
	  }, {
	    key: "anonyFunction",
	    value: function anonyFunction(func) {
	      var funcName = this.randmonId();
	      window[funcName] = func;
	      return funcName;
	    }
	  }, {
	    key: "randomInt",
	    value: function randomInt(len) {
	      if (typeof len !== 'number') {
	        len = 100;
	      }

	      return Math.ceil(Math.random() * Math.pow(10, Math.ceil(len / 10))) % len;
	    }
	  }, {
	    key: "randomAlphabetStr",
	    value: function randomAlphabetStr(len) {
	      if (typeof len !== 'number') {
	        len = 6;
	      }

	      var set = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	      var ans = '';

	      for (var i = 0; i < len; i++) {
	        ans += set[this.randomInt(set.length)];
	      }

	      return ans;
	    }
	  }, {
	    key: "randomEmoji",
	    value: function randomEmoji(len) {
	      if (typeof len !== 'number') {
	        len = 1;
	      }

	      var set = ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '😇', '😐', '😑', '😶', '😏', '😣', '😥', '😮', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '😒', '😓', '😔', '😕', '😲', '😷', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😬', '😰', '😱', '😳', '😵', '😡', '😠', '👦', '👧', '👨', '👩', '👴', '👵', '👶', '👱', '👮', '👲', '👳', '👷', '👸', '💂', '🎅', '👰', '👼', '💆', '💇', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🙇', '🙌', '🙏', '👤', '👥', '🚶', '🏃', '👯', '💃', '👫', '👬', '👭', '💏', '💑', '👪'];
	      var ans = '';

	      for (var i = 0; i < len; i++) {
	        ans += set[this.randomInt(set.length)];
	      }

	      return ans;
	    }
	  }, {
	    key: "addContextMenu",
	    value: function addContextMenu(elemt, listener, whenCancelMenu) {
	      elemt.addEventListener('contextmenu', function (e) {
	        e.preventDefault();
	        var moousePosi = $$.getMousePositionInElement(document.body, e);
	        var contextMenu = $$.creEle('absolute');
	        document.body.appendChild(contextMenu);
	        $$.setStyle(contextMenu, {
	          left: moousePosi.left,
	          top: moousePosi.top
	        });

	        var makeVisible = function makeVisible() {
	          var menuInfo = $$.getElementInfo(contextMenu);
	          var rectInfo = contextMenu.getBoundingClientRect(); // 高度超出

	          if (rectInfo.top + menuInfo.height > window.innerHeight) {
	            $$.setStyle(contextMenu, {
	              top: menuInfo.top - (rectInfo.top + menuInfo.height - window.innerHeight)
	            });
	          } // 宽度超出


	          if (rectInfo.left + menuInfo.width > window.innerWidth) {
	            $$.setStyle(contextMenu, {
	              left: menuInfo.left - (rectInfo.left + menuInfo.width - window.innerWidth)
	            });
	          }
	        };

	        var stopPropagation = function stopPropagation(e) {
	          e.stopPropagation();
	        };

	        var cancel = function cancel() {
	          document.body.removeChild(contextMenu);
	          window.removeEventListener('click', cancel);
	          window.removeEventListener('contextmenu', cancelCon);
	          if (whenCancelMenu) whenCancelMenu();
	        }; // 避免第一次打开就被关闭


	        var firstContextMenu = true;

	        var cancelCon = function cancelCon() {
	          if (firstContextMenu) {
	            firstContextMenu = false;
	            return;
	          }

	          cancel();
	        };

	        window.addEventListener('click', cancel);
	        window.addEventListener('contextmenu', cancelCon);
	        contextMenu.addEventListener('click', stopPropagation);
	        contextMenu.addEventListener('contextmenu', stopPropagation);
	        listener(contextMenu, {
	          cancelMenu: function cancelMenu() {
	            cancel();
	          },
	          makeVisible: makeVisible
	        }, e);
	        makeVisible();
	      });
	    }
	  }, {
	    key: "getCommonAncestor",
	    value: function getCommonAncestor(n1, n2, getParent, root) {
	      if (!n1 || !n2) return undefined;

	      var parent = function parent(node) {
	        var p = getParent(node);
	        if (p) return p;
	      };

	      var n1Path = new Array();
	      var curN1 = n1;

	      do {
	        if (curN1) n1Path.push(curN1);
	        curN1 = parent(curN1);
	      } while (curN1 !== root);

	      if (root) n1Path.push(root);

	      while (n2) {
	        for (var i = 0; i < n1Path.length; i++) {
	          if (n2 === n1Path[i]) {
	            return n2;
	          }
	        }

	        n2 = parent(n2);
	      }
	    }
	    /**
	     *
	     * @param node
	     * @param stage 0 代表 root
	     * @param getParent
	     * @param isRoot
	     */

	  }, {
	    key: "getRefStageNode",
	    value: function getRefStageNode(node, stage, getParent, isRoot) {
	      var path = new Array();

	      while (node && !isRoot(node)) {
	        path.push(node);
	        node = getParent(node);
	      }

	      if (!isRoot(node)) return undefined;
	      path.push(node);

	      if (path.length > stage) {
	        return path[path.length - 1 - stage];
	      }
	    }
	  }, {
	    key: "insertStrBefore",
	    value: function insertStrBefore(soure, start, newStr) {
	      return soure.slice(0, start) + newStr + soure.slice(start);
	    }
	    /**
	     * sortedRanges 中的元素的第二位是指的偏移量
	     */

	  }, {
	    key: "findInWhichRange",
	    value: function findInWhichRange(sortedRanges, value) {
	      var ans = {
	        foundRange: undefined,
	        nearestNextRange: undefined,
	        nearestPreRange: undefined
	      };
	      if (sortedRanges.length === 0) return ans;

	      var inRange = function inRange(range, value) {
	        return value >= range[0] && value < range[0] + range[1];
	      };

	      var inLeft = function inLeft(range, value) {
	        return value < range[0];
	      };

	      if (sortedRanges.length === 1) {
	        if (inLeft(sortedRanges[0], value)) {
	          ans.nearestNextRange = sortedRanges[0];
	        } else if (inRange(sortedRanges[0], value)) {
	          ans.foundRange = sortedRanges[0];
	        } else {
	          ans.nearestPreRange = sortedRanges[0];
	        }

	        return ans;
	      }

	      var critical = Math.floor(sortedRanges.length / 2);
	      var preCritical = 0;

	      while (critical !== preCritical) {
	        if (inRange(sortedRanges[critical], value)) {
	          ans.foundRange = sortedRanges[critical];
	          ans.nearestNextRange = critical + 1 < sortedRanges.length ? sortedRanges[critical + 1] : undefined;
	          ans.nearestPreRange = critical - 1 >= 0 ? sortedRanges[critical - 1] : undefined;
	          return ans;
	        }

	        var curCritical = critical;
	        var harf = Math.floor(Math.abs(preCritical - curCritical) / 2);

	        if (inLeft(sortedRanges[critical], value)) {
	          if (harf === 0) {
	            if (critical > 0 && inRange(sortedRanges[critical - 1], value)) {
	              ans.foundRange = sortedRanges[critical - 1];
	              ans.nearestNextRange = critical < sortedRanges.length ? sortedRanges[critical] : undefined;
	              ans.nearestPreRange = critical - 2 >= 0 ? sortedRanges[critical - 2] : undefined;
	              return ans;
	            } else {
	              if (critical > 0 && value < sortedRanges[critical - 1][0]) {
	                ans.nearestNextRange = sortedRanges[critical - 1];
	                ans.nearestPreRange = critical - 2 >= 0 ? sortedRanges[critical - 2] : undefined;
	              } else {
	                ans.nearestNextRange = sortedRanges[critical];
	                ans.nearestPreRange = critical - 1 >= 0 ? sortedRanges[critical - 1] : undefined;
	              }
	            }
	          } else {
	            critical -= harf;
	          }
	        } else {
	          if (harf === 0) {
	            if (critical < sortedRanges.length - 1 && inRange(sortedRanges[critical + 1], value)) {
	              ans.foundRange = sortedRanges[critical + 1];
	              ans.nearestNextRange = critical + 2 < sortedRanges.length ? sortedRanges[critical + 2] : undefined;
	              ans.nearestPreRange = critical - 1 > 0 ? sortedRanges[critical - 1] : undefined;
	              return ans;
	            } else {
	              ans.nearestNextRange = sortedRanges[critical + 1];
	              ans.nearestPreRange = critical >= 0 ? sortedRanges[critical] : undefined;
	            }
	          } else {
	            critical += harf;
	          }
	        }

	        preCritical = curCritical;
	      }

	      return ans;
	    }
	  }]);

	  return $$;
	}();
	$$.timeoutIdMap = new Map();
	$$.dragStates = new Map();
	$$.sheetName = $$.randmonId();

	var BidMap = /*#__PURE__*/function () {
	  function BidMap() {
	    classCallCheck(this, BidMap);

	    this.keyMap = new Map();
	    this.valueMap = new Map();
	  }

	  createClass(BidMap, [{
	    key: "getvalue",
	    value: function getvalue(k) {
	      return this.keyMap.get(k);
	    }
	  }, {
	    key: "getkey",
	    value: function getkey(v) {
	      return this.valueMap.get(v);
	    }
	  }, {
	    key: "set",
	    value: function set(k, v) {
	      this.keyMap.set(k, v);
	      this.valueMap.set(v, k);
	    }
	  }, {
	    key: "remove",
	    value: function remove(k) {
	      this.valueMap["delete"](this.getvalue(k));
	      this.keyMap["delete"](k);
	    }
	  }]);

	  return BidMap;
	}();

	function _createForOfIteratorHelper$1(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

	function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	var EventManager = /*#__PURE__*/function () {
	  function EventManager() {
	    var _this = this;

	    classCallCheck(this, EventManager);

	    this.eventMap = new Map();
	    this.eventTriggleTimes = new Map();
	    this.eventDependencies = new Map(); // 记录事件依赖的前置事件

	    this.eventRelyOn = new Map(); // 记录该事件被那些事件作为前置事件
	    // 如果执行的事件失败, 则会在指定的延迟时间之后再次执行

	    this.execEvent = function (id, event) {
	      try {
	        var result = event();

	        if (result) {
	          var retry = result.retry,
	              delayTime = result.delayTime;

	          if (retry) {
	            if (!delayTime) delayTime = 0;
	            setTimeout(function () {
	              return _this.execEvent(id, event);
	            }, delayTime);
	          }
	        }
	      } catch (e) {
	        // pass
	        console.log("----------\u4E8B\u4EF6\u6D41\u9519\u8BEF: ".concat(id, "------------------\n"), e);
	      }
	    };
	    /**
	     *
	     * 触发依赖于该事件的事件
	     * @param id 被依赖的事件id
	     */


	    this.triggleRelyEvent = function (id) {
	      var relyons = _this.eventRelyOn.get(id);

	      if (relyons) {
	        var _iterator = _createForOfIteratorHelper$1(relyons),
	            _step;

	        try {
	          for (_iterator.s(); !(_step = _iterator.n()).done;) {
	            var eventId = _step.value;

	            var dependencies = _this.eventDependencies.get(eventId);

	            if (dependencies) {
	              var exec = true;

	              var _iterator2 = _createForOfIteratorHelper$1(dependencies),
	                  _step2;

	              try {
	                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	                  var dependentId = _step2.value;
	                  if (dependentId === id) continue;

	                  if (!_this.eventTriggleTimes.get(dependentId)) {
	                    exec = false;
	                    break;
	                  }
	                }
	              } catch (err) {
	                _iterator2.e(err);
	              } finally {
	                _iterator2.f();
	              }

	              if (exec) {
	                _this.triggleEvent(eventId);
	              }
	            }
	          }
	        } catch (err) {
	          _iterator.e(err);
	        } finally {
	          _iterator.f();
	        }
	      }
	    };
	  }

	  createClass(EventManager, [{
	    key: "bindEventOnMany",
	    value: function bindEventOnMany(ids, event, execNow) {
	      var _this2 = this;

	      ids.forEach(function (id) {
	        return _this2.bindEventOn(id, event, execNow);
	      });
	    } // 注册事件

	  }, {
	    key: "bindEventOn",
	    value: function bindEventOn(id, event, execNow) {
	      var eventList = this.eventMap.get(id);

	      if (!eventList) {
	        eventList = [];
	        this.eventMap.set(id, eventList);
	      }

	      eventList.push(event);
	      if (execNow) this.execEvent(id, event);
	    } // 注册依赖事件触发链
	    // 仅当所有所有事件 dependsOn 都都至少执行一次后才会触发

	  }, {
	    key: "bindEventAtLeastExecOnceOn",
	    value: function bindEventAtLeastExecOnceOn(dependsOn, id, event) {
	      var _this3 = this;

	      if (!id) id = uuid_1.v1();
	      var dependencies = this.eventDependencies.get(id);

	      if (!dependencies) {
	        dependencies = new Set();
	        this.eventDependencies.set(id, dependencies);
	      }

	      dependsOn.forEach(function (item) {
	        var _dependencies;

	        var relyons = _this3.eventRelyOn.get(item);

	        if (!relyons) {
	          relyons = new Set();

	          _this3.eventRelyOn.set(item, relyons);
	        }

	        if (id) relyons.add(id);else throw new Error("System error");
	        (_dependencies = dependencies) === null || _dependencies === void 0 ? void 0 : _dependencies.add(item);
	      });
	      this.bindEventOn(id, event);
	    } // 触发事件

	  }, {
	    key: "triggleEvent",
	    value: function triggleEvent() {
	      for (var _len = arguments.length, ids = new Array(_len), _key = 0; _key < _len; _key++) {
	        ids[_key] = arguments[_key];
	      }

	      for (var _i = 0, _ids = ids; _i < _ids.length; _i++) {
	        var id = _ids[_i];
	        var eventList = this.eventMap.get(id);

	        if (!eventList) {
	          eventList = [];
	          this.eventMap.set(id, eventList);
	        }

	        var times = this.eventTriggleTimes.get(id) || 0;
	        times += 1;

	        if (times > 1000) {
	          times = 1000; // 事件的最大执行次数只记录到1000次
	        }

	        this.eventTriggleTimes.set(id, times);

	        var _iterator3 = _createForOfIteratorHelper$1(eventList),
	            _step3;

	        try {
	          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	            var event = _step3.value;
	            this.execEvent(id, event);
	          }
	        } catch (err) {
	          _iterator3.e(err);
	        } finally {
	          _iterator3.f();
	        }

	        this.triggleRelyEvent(id);
	      }
	    }
	  }]);

	  return EventManager;
	}();

	function _createForOfIteratorHelper$2(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

	function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	var DataListener = /*#__PURE__*/function () {
	  function DataListener(interval) {
	    var _this = this;

	    classCallCheck(this, DataListener);

	    this.contextList = new Array();
	    this.loops = new Array();
	    setInterval(function () {
	      var _iterator = _createForOfIteratorHelper$2(_this.contextList),
	          _step;

	      try {
	        for (_iterator.s(); !(_step = _iterator.n()).done;) {
	          var item = _step.value;

	          var _item = slicedToArray(item, 3),
	              context = _item[0],
	              contextFunc = _item[1],
	              callback = _item[2];

	          var newcontext = contextFunc();
	          item[0] = newcontext;

	          if (!_this.isContextEqual(context, newcontext)) {
	            _this.exectCallback(callback, newcontext);
	          }
	        }
	      } catch (err) {
	        _iterator.e(err);
	      } finally {
	        _iterator.f();
	      }

	      var _iterator2 = _createForOfIteratorHelper$2(_this.loops),
	          _step2;

	      try {
	        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	          var _item2 = _step2.value;

	          _this.exectCallback(_item2);
	        }
	      } catch (err) {
	        _iterator2.e(err);
	      } finally {
	        _iterator2.f();
	      }
	    }, interval);
	  }

	  createClass(DataListener, [{
	    key: "exectCallback",
	    value: function exectCallback(callback, context) {
	      try {
	        callback(context);
	      } catch (e) {
	        console.log("-----------数据监听器回调失败----------\n", e);
	      }
	    }
	  }, {
	    key: "isContextEqual",
	    value: function isContextEqual(context_1, context_2) {
	      if (_typeof_1(context_1) === 'object' && context_1 !== null && _typeof_1(context_2) === 'object' && context_2 !== null) {
	        for (var _i = 0, _Object$keys = Object.keys(context_1); _i < _Object$keys.length; _i++) {
	          var key = _Object$keys[_i];
	          if (context_1[key] !== context_2[key]) return false;
	        }

	        if (Object.keys(context_1).length !== Object.keys(context_2).length) {
	          for (var _i2 = 0, _Object$keys2 = Object.keys(context_2); _i2 < _Object$keys2.length; _i2++) {
	            var _key = _Object$keys2[_i2];
	            if (context_1[_key] !== context_2[_key]) return false;
	          }
	        }

	        return true;
	      } else if (Array.isArray(context_1) && Array.isArray(context_2)) {
	        if (context_1.length !== context_2.length) return false;

	        for (var index in context_1) {
	          if (context_1[index] !== context_2[index]) return false;
	        }

	        return true;
	      } else {
	        return context_1 === context_2;
	      }
	    }
	  }, {
	    key: "addListener",
	    value: function addListener(contextFunc, callBack, firstExecCallback) {
	      var context = contextFunc();
	      this.contextList.push([context, contextFunc, callBack]);
	      if (firstExecCallback) this.exectCallback(callBack, context);
	    }
	  }, {
	    key: "addLoop",
	    value: function addLoop(loop) {
	      this.loops.push(loop);
	    }
	  }]);

	  return DataListener;
	}();

	function _createForOfIteratorHelper$3(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$4(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }

	function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	function extend(ele, extendFunctions) {
	  var _iterator = _createForOfIteratorHelper$3(extendFunctions),
	      _step;

	  try {
	    for (_iterator.s(); !(_step = _iterator.n()).done;) {
	      var ex = _step.value;
	      var exts = ex(ele);

	      for (var name in exts) {
	        ele[name] = exts[name];
	      }
	    }
	  } catch (err) {
	    _iterator.e(err);
	  } finally {
	    _iterator.f();
	  }

	  return ele;
	}

	function innerHtml(ele, str, clearBefore) {
	  if (clearBefore) ele.innerHTML = '';
	  str = str.trim();
	  var stack = new Array();
	  var ans = new Array();
	  var inStartTag = false;

	  for (var i = 0; i < str.length; i++) {
	    if (isStartTarg(i, str)) {
	      inStartTag = true;
	      var data = '';

	      while (++i && !isEnd(i, str)) {
	        data += str[i];
	      }

	      var node = new Node(data);
	      stack.push(node);
	    } else if (isEndTarg(i, str)) {
	      while (!isEnd(i, str)) {
	        i++;
	      }

	      var _node = stack.pop();

	      if ($$.stackPeek(stack)) {
	        var _ele = _node.htmlEle();

	        var parent = $$.stackPeek(stack);
	        parent.htmlEle().appendChild(_ele);
	      } else {
	        inStartTag = false;
	        ans.push(_node.htmlEle());
	      }
	    } else if (inStartTag && !isStartTarg(i, str)) {
	      if ($$.stackPeek(stack)) $$.stackPeek(stack).innerText += str[i];
	    }
	  }

	  ans.forEach(function (child) {
	    return ele.appendChild(child);
	  });
	}

	var Node = /*#__PURE__*/function () {
	  function Node(data) {
	    classCallCheck(this, Node);

	    this.data = [];
	    this.innerText = '';
	    var started = false;
	    var inStr = false;
	    var item = '';

	    for (var i = 0; i < data.length; i++) {
	      if (!isBlank(i, data) && !started && !inStr) {
	        started = true;
	        item += data[i];
	      } else if (isBlank(i, data) && !inStr && started) {
	        started = false;
	        this.data.push(item);
	        item = '';
	      } else if (data[i] === '"' && started && !inStr) {
	        inStr = true;
	      } else if (data[i] === '"' && inStr) {
	        inStr = false;
	      } else if (started) {
	        item += data[i];
	      }
	    }

	    if (item !== '') this.data.push(item);
	  }

	  createClass(Node, [{
	    key: "htmlEle",
	    value: function htmlEle() {
	      if (this.ele) return this.ele;
	      this.ele = document.createElement(this.data[0]);
	      var innerText = this.innerText.trim();
	      if (innerText !== '') this.ele.innerText = innerText;

	      for (var i = 1; i < this.data.length; i++) {
	        var _this$data$i$split = this.data[i].split('='),
	            _this$data$i$split2 = slicedToArray(_this$data$i$split, 2),
	            key = _this$data$i$split2[0],
	            value = _this$data$i$split2[1];

	        if (key === 'style') {
	          $$.setStyle(this.ele, $$.getInlineCssStyle(value));
	        } else if (key === 'id') {
	          this.ele.id = value;
	        } else {
	          this.ele.setAttribute(key, value || '');
	        }
	      }

	      return this.ele;
	    }
	  }]);

	  return Node;
	}();

	function isStartTarg(i, str) {
	  return str[i] === "<" && i + 1 < str.length && str[i + 1] !== '/';
	}

	function isEndTarg(i, str) {
	  return str[i] === "<" && i + 1 < str.length && str[i + 1] === '/';
	}

	function isEnd(i, str) {
	  return str[i] === '>';
	}

	function isBlank(i, str) {
	  return /\s/.test(str[i]);
	}

	function stepper(from, to, spendTime, eachTime, consumer) {
	  if (spendTime < eachTime) spendTime = eachTime;
	  var times = spendTime / eachTime;
	  var len = to - from;
	  var step = len / times;
	  var executedTimes = 0;

	  var func = function func() {
	    from += step;
	    executedTimes++;
	    consumer(from);

	    if (executedTimes < times) {
	      window.setTimeout(function () {
	        return func();
	      }, eachTime);
	    }
	  };

	  func();
	}

	function ct(o) {
	  return o;
	}

	var Nil = undefined;

	function mouseHover(ele, callback) {
	  ele.addEventListener('mouseover', function () {
	    callback('hover');
	  });
	  ele.addEventListener('mouseout', function () {
	    callback('leave');
	  });
	}

	exports.$ = $;
	exports.$$ = $$;
	exports.BidMap = BidMap;
	exports.DataListener = DataListener;
	exports.EventManager = EventManager;
	exports.Nil = Nil;
	exports.ct = ct;
	exports.extend = extend;
	exports.innerHtml = innerHtml;
	exports.mouseHover = mouseHover;
	exports.stepper = stepper;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=utils.js.map
