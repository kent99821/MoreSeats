var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
    skip: 0,
    showTop: false,
    topData: {},
    test: [{

    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // navigateToChair() {
  //   let roomId = this.data.historyList[0].roomId;
  //   let chairIndex = this.data.historyList[0].chairIndex;
  //   wx.navigateTo({
  //     url: '../chair/chair?roomId=' + roomId + '&chairIndex=' + chairIndex,
  //   })
  // },
  navigateToNow(){
    let roomId = this.data.roomId;
    wx.navigateTo({
      url: '../adminRoomNow/adminRoomNow?roomId=' + roomId,
    })
  },
    getHistoryList() {
    let len = this.data.historyList.length;
    let num = 15;
    if (len > 10) num = 10;

    wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 2,
        roomId: this.data.roomId,
        isOver: true,
        skip: len,
        num: num
      },
      success: res => {
        console.log(res)
        let historyList = res.result.data;
        if (historyList.length > 0) {
          historyList = historyList.map((item) => {
            let sTime = item.ssTime
            item.ssTime = sTime.split('T')[0].split('-').join('.') + ' ' + sTime.split('T')[1].split('.')[0].split(':')[0] +":"+ sTime.split('T')[1].split('.')[0].split(':')[1];
            return item;
          })
          this.setData({
            historyList: [...this.data.historyList,...res.result.data]
          })
        }

      },
      fail: err => {
        console.log('调用失败：', err)
      }
    })

  },
  onLoad: function (options) {
    let roomId = options.roomId
    console.log(options);
    // if (!roomId) roomId = '454914'
    // console.log(roomId)
    this.setData({ roomId: roomId })
    this.getHistoryList()
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
    // this.getHistoryList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('test')
    this.getHistoryList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})