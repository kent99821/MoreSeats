// pages/adminRule/adminRule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islimit: false,
    typeArr: [],
    typeName: "范围打",
    size: 0,
    latitude: 0,
    longitude: 0,
    options: [{ label: '范围打卡', value: 1 },
    { label: '范卡', value: 3 },
    {
      label: 'CV打卡', value: 2,
      // disabled: true
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
          islimit: res.result.data.rule.type === 0,
          ...res.result.data.rule
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
  onConfirm: function (e) {
    console.log(e);
    this.setData({
      typeName: e.detail.label,
      typeArr: e.detail.value
    })
  },
  onValueChange: function (e) {
    console.log(e);
    this.setData({
      typeArr: e.detail.value
    })
  },
  onSwitchChange: function () {
    this.setData({
      islimit: !this.data.islimit,
      // 'config.type': !this.data.config.type,

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