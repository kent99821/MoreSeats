// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId: "",
    rank: [{
      openId: "watermelon-1",
      roomId: "123456",
      uTimeSum: 20,
      userName: "watermelon"
    }]
  },
  getRank: function (skip, num) {
    let roomId = this.data.roomId
    wx.cloud.callFunction({
      name: 'getRank',
      data: {
        roomId,
        skip,
        num
      },
      success: res => {
        console.log(res)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.roomId);
    this.setData({
      roomId: options.roomId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getRank(0, 2)
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