import {
  $wuxDialog,
  $wuxToptips
} from '../../miniprogram_npm/wux-weapp/index.js'
// pages/getQR/getQR.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num1: 1,
    num2: 5,
    code: "!@#$%^&*()_+",
    codeIn: "",
    show: false,
    codeShow: true,
    roomId: "",
    typeName: "",
    type: -1,
    isRes: false,
    res: "请点击生成",
    actions: [{
      name: '座位码',
      subname: '可张贴在实体座位上，扫码跳转对应座位页面',
      type: 0
    },
    {
      name: '自习室码',
      subname: '扫码后跳转对应自习室页面',
      type: 1
    }, {
      name: '签到码（开发中）',
      disabled: true,
      subname: '打卡前需通过签到码验证',
      type: 2
    },
    ],
  },



  cpurl: function () {
    wx.setClipboardData({
      data: this.data.res,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  typeInCode: function (e) {
    console.log(e);
    this.setData({
      codeIn: e.detail.value,
    })
  },
  onCodeChange: function (e) {
    console.log(e);
    this.setData({
      code: e.detail.value,
    })
  },

  num1Change: function (e) {
    console.log(e);
    this.setData({
      num1: e.detail,
    })
  },
  num2Change: function (e) {
    console.log(e);
    this.setData({
      num2: e.detail,
    })
  },
  onSelect: function (e) {
    console.log(e);
    this.setData({
      typeName: e.detail.name,
      show: false,
      type: e.detail.type,
    })
  },
  openSelect: function () {
    this.setData({
      show: true
    })
  },
  closeSelect: function () {
    this.setData({
      show: false
    })
  },
  postConfig: function () {
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.type == -1) {
      $wuxToptips().warn({
        text: '请选择类型',
        duration: 3000
      })
      return
    }
    if (this.data.codeIn != this.data.code) {
      $wuxToptips().warn({
        text: '请检查验证码',
        duration: 3000
      })
      return
    }
    wx.showLoading({
      title: '生成中',
    })
    wx.cloud.callFunction({
      name: 'getQR',
      data: {
        flag: this.data.type,
        chairNum: this.data.num2,
        indexStart: this.data.num1 - 1,
        roomId: this.data.roomId
      },
      success: res => {
        console.log(res)
        this.setData({
          isRes: true,
          res: res.result.tempFileURL,
        })
        wx.hideLoading()
        $wuxToptips().success({
          text: '点击下方复制链接，前往浏览器下载',
          duration: 3000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '云开发出现了些问题，请联系管理员排查！',
          icon: "none"
        })
        console.log(res);
      }
    })
    this.setData({
      codeShow: false
    })
    this.setData({
      codeShow: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      roomId: options.roomId
    })
  },
})