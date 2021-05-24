import { $wuxDialog, $wuxToptips } from '../../miniprogram_npm/wux-weapp/index.js'
// pages/adminRule/adminRule.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    islimit: false,
    typeName: "范围打卡",
    size: 5,
    latitude: 0,
    longitude: 0,
    show: false,
    hasMap: false,
    actions: [
      {
        name: '范围打卡',
        subname: '限制用户仅在范围内打卡'
      },
      {
        name: 'CV打卡（开发中）',
        disabled: true,
        subname: '智能识别打卡与签退'
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
        console.log(res.result.data.rule)
        this.setData({
          islimit: res.result.data.rule.type !== 0,
          ...res.result.data.rule,
          hasMap: res.result.data.latitude !== 0
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
      mask: true
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
        $wuxToptips().success({
          text: '修改成功',
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
  },
  mapSelect: function (e) {
    wx.chooseLocation({
      success: (e) => {
        console.log(e);
        this.setData({
          longitude: e.longitude,
          latitude: e.latitude,
          hasMap: true
        })
      }
    })

  },
  onSelect: function (e) {
    console.log(e);
    this.setData({
      typeName: e.detail.name,
      show: false,
      type: 1
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
  onSwitchChange: function () {
    this.setData({
      islimit: !this.data.islimit,
      // 'config.type': !this.data.config.type,

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