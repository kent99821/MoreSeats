// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList:[],
    skip: 0,
    showTop:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getHistoryList(){

    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        flag: 1,
        skip: this.data.historyList.length
      },
      success: res => {

        this.setData({
          historyList: [...this.data.historyList, ...res.result.data],
        })
        console.log(this.data.historyList)

      },
      fail: err => {
        console.log('调用失败：', err)
      }
    })

  },
  onLoad: function (options) {
    this.getHistoryList();
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
    this.getHistoryList();
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