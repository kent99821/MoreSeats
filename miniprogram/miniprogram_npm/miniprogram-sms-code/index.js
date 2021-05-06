module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Component({
  /**
   * 允许外部类名，开发者通过设置 以下三个类名 设置自己的样式覆盖组件默认样式
   */
  externalClasses: ['active-class', 'unactive-class', 'dot-class'],
  /**
   * 父组件传入的值
   */
  properties: {
    // 短信验证码类型，数字or字母or...
    codeType: {
      type: String,
      value: 'number'
    },
    // 短信验证码长度
    codeCount: {
      type: Number,
      value: 6
    },
    // 是否自动拉起输入框
    isAuto: {
      type: Boolean,
      value: false
    }
  },
  data: {
    inputTop: '0rpx',
    valueItem: [],
    currentIndex: 0,
    isShowActive: false
  },
  /**
   * 组件生命周期
   */
  lifetimes: {
    attached: function attached() {
      var itemTemp = [];
      for (var i = 0; i < this.data.codeCount; i++) {
        itemTemp.push({
          key: i,
          value: ''
        });
      }
      this.setData({
        valueItem: itemTemp,
        isShowActive: !!this.data.isAuto
      });
    }
  },
  methods: {
    /**
     * 输入验证码
     */
    input: function input(e) {
      var _this = this;

      var valueArr = e.detail.value.split('');
      this.triggerEvent('changeCode', {
        value: e.detail.value
      }); // 触发父页面的事件，
      this.setData({
        currentIndex: valueArr.length
      });
      for (var i = valueArr.length; i < this.data.codeCount; i++) {
        var _setData;

        var keyName = 'valueItem[' + i + '].value';
        this.setData((_setData = {}, _setData[keyName] = '', _setData));
      }
      valueArr.forEach(function (value, index) {
        var _this$setData;

        var keyName = 'valueItem[' + index + '].value';
        _this.setData((_this$setData = {}, _this$setData[keyName] = value, _this$setData));
      });
    },

    /**
     * code输入框获得焦点
     * 将输入框移动到屏幕以外，用户不可见
     */
    focus: function focus() {
      this.setData({
        inputTop: '-9999rpx',
        isShowActive: true
      });
    },

    /**
     * code输入框失去焦点
     * 将输入框移动到原来的位置，用户下次点击时触发获得焦点事件
     */
    blur: function blur() {
      this.setData({
        inputTop: '0rpx',
        isShowActive: false
      });
    }
  }
});

/***/ })
/******/ ]);