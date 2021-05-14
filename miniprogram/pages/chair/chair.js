// pages/chair/chair.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId: '',
    chairIndex: '',
    btnType: 2,//下方按钮 0:坐下 1:签退 2:被占用
    show: 1,//中间显示 0:时长 1:事项
    todo: [
      { s: false, c: "123" },
      { s: true, c: "fdasdfsa" },
      { s: false, c: "6c6sa5dxxxxc4" }
    ],
    mapShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // this.setData({
    //   roomId: options.roomId,
    //   chairIndex: options.chairIndex
    // })



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //重新计算公告栏内文字长度以判断是否滚动
    this.selectComponent("#ntc").resetAnimation()
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

  },
  /**
   * 切换分段器 
   */
  changeCTL: function (e) {
    console.log(e);
    this.setData({
      show: e.detail.key
    })
  },
  /**
   * 坐下
   */
  signIn: function () {

  },
  /**
   * 签退
   */
  signOut: function () {

  },
  /**
   * 被占用提示
   */
  warningTips: function () {

  },
  /**
   * 关闭地图
   */
  mapClose: function () {
    this.setData({
      mapShow: false
    })
  }
})