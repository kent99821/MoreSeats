// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [1,2,3,4,5], 
  },
  

  /*
    获取缓存信息
  */
 getHistory(){

  //  wx.setStorage({
  //    data: [1,2,3,4,5,6],
  //    key: 'historyList',
  //  })
   let val = wx.getStorageSync('historyList');
   this.setData({historyList: val})
  //  console.log(this.data.historyList);
 },

  /*
    删除历史某个记录
  */
 deleteHistroryItem(e){
  let index = e.data.val;
  let val = this.data.historyList.splice(index, 1);
  this.setData({historyList:val});
},





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistory()
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