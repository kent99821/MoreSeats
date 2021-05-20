import { $wuxDialog, $wuxToptips } from '../../miniprogram_npm/wux-weapp/index.js'
// pages/adminRule/adminRule.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    typeName: "平铺",
    activeTab:1,
    type: 0,
    chairNum: 0,
    show: false,
    actions: [
      {
        name: '平铺',
        subname: '适用于小型自习室',
        type: 0
      },
      {
        name: '分组',
        subname: '适用于大型自习室',
        type: 1
      }, {
        name: '平面图（开发中）',
        disabled: true,
        subname: '按真实座位排布显示',
        type: 2
      },],
    roomId: ""
  },
  getConfig: async function (roomId) {
    await wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 1,
        roomId
      },
      success: res => {
        console.log(res.result.data.chairs)
        this.setData({
          ...res.result.data.chairs,
          typeName: this.data.actions.find(i => i.type === res.result.data.chairs.type).name
        })
        if (res.result.data.rule.size === 0) {
          this.setData({
            size: 5
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '云开发出现了些问题，请联系管理员排查！',
          icon: "none"
        })
        console.log(res);
      }
    })
  },
  postConfig: async function () {
    wx.showLoading({
      title: '请求中',
    })
    console.log({
      type: this.data.islimit ? 1 : 0,
      size: this.data.size,
      longitude: this.data.longitude,
      latitude: this.data.latitude,
    });
    await wx.cloud.callFunction({
      name: 'adminAction',
      data: {
        flag: 4,
        rule: {
          type: this.data.islimit ? 1 : 0,
          size: this.data.size,
          longitude: this.data.longitude,
          latitude: this.data.latitude,
        },
        roomId: this.data.roomId
      },
      success: res => {
        console.log(res);
        wx.hideLoading()
        //


      },
      fail: (res) => {
        wx.showToast({
          title: '云开发出现了些问题，请联系管理员排查！',
          icon: "none"
        })
        console.log(res);
      }
    })
  },
  onSelect: function (e) {
    console.log(e);
    this.setData({
      typeName: e.detail.name,
      show: false,
      type: e.detail.type
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
  sizeChange: function (e) {
    console.log(e);
    this.setData({
      size: e.detail,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      roomId: options.roomId
    })
    this.getConfig(options.roomId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})