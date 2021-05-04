"use strict";var _baseComponent=_interopRequireDefault(require("../helpers/baseComponent")),_classNames7=_interopRequireDefault(require("../helpers/classNames"));function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function ownKeys(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,r)}return n}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(n,!0).forEach(function(e){_defineProperty(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):ownKeys(n).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var defaults={prefixCls:"wux-actionsheet",theme:"ios",className:"",titleText:"",buttons:[],buttonClicked:function(){},cancelText:"取消",cancel:function(){}};(0,_baseComponent.default)({useFunc:!0,data:defaults,computed:{classes:["prefixCls, theme, buttons, cancelText",function(n,e,t,r){var o,c=(0,_classNames7.default)(n),a="".concat(n,"__popup"),s=(0,_classNames7.default)("".concat(n,"__content"),(_defineProperty(o={},"".concat(n,"__content--theme-").concat(e),e),_defineProperty(o,"".concat(n,"__content--has-cancel"),r),o)),i=(0,_classNames7.default)("".concat(n,"__group"),_defineProperty({},"".concat(n,"__group--options"),!0)),u="".concat(n,"__title"),d=(0,_classNames7.default)("".concat(n,"__button"),_defineProperty({},"".concat(n,"__button--destructive"),!0));return{wrap:c,popup:a,content:s,options:i,title:u,button:t.map(function(e){var t;return{wrap:(0,_classNames7.default)("".concat(n,"__button"),(_defineProperty(t={},"".concat(n,"__button--option"),!0),_defineProperty(t,"".concat(n,"__button--disabled"),e.disabled),_defineProperty(t,"".concat(e.className),e.className),t)),hover:e.hoverClass&&"default"!==e.hoverClass?e.hoverClass:"".concat(n,"__button--hover")}}),icon:"".concat(n,"__icon"),text:"".concat(n,"__text"),destructive:d,group:(0,_classNames7.default)("".concat(n,"__group"),_defineProperty({},"".concat(n,"__group--cancel"),!0)),cancel:(0,_classNames7.default)("".concat(n,"__button"),_defineProperty({},"".concat(n,"__button--cancel"),!0)),hover:"".concat(n,"__button--hover")}}]},methods:{showSheet:function(e){var t=0<arguments.length&&void 0!==e?e:{},n=this.$$mergeOptionsAndBindMethods(Object.assign({},defaults,t));return this.removed=!1,this.$$setData(_objectSpread({in:!0},n)),this.cancel.bind(this)},removeSheet:function(e){if(this.removed)return!1;this.removed=!0,this.$$setData({in:!1}),"function"==typeof e&&e(this.data.buttons)},buttonClicked:function(e){var t=e.currentTarget.dataset.index;!0===this.fns.buttonClicked(t,this.data.buttons[t])&&this.removeSheet()},destructiveButtonClicked:function(){!0===this.fns.destructiveButtonClicked()&&this.removeSheet()},cancel:function(){this.removeSheet(this.fns.cancel)},bindgetuserinfo:function(e){this.triggerEvent("getuserinfo",_objectSpread({},e.detail,{},e.currentTarget.dataset))},bindcontact:function(e){this.triggerEvent("contact",_objectSpread({},e.detail,{},e.currentTarget.dataset))},bindgetphonenumber:function(e){this.triggerEvent("getphonenumber",_objectSpread({},e.detail,{},e.currentTarget.dataset))},bindopensetting:function(e){this.triggerEvent("opensetting",_objectSpread({},e.detail,{},e.currentTarget.dataset))},onError:function(e){this.triggerEvent("error",_objectSpread({},e.detail,{},e.currentTarget.dataset))}}});