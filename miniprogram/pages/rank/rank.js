import {
  $wuxToptips
} from '../../miniprogram_npm/wux-weapp/index.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
    rankList: [],
    skip: 0,
    showTop: false,
    topData: {},
    roomId: "",
    pep: -1,
    tim: -1,
    test: [{

    }],

    // isOP:false,
    isOP: false,
    cps: false,
    cts: false
  },
  // 清除排名
  cleanRank() {
    wx.showLoading({
      title: '重置中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'adminAction',
      data: {
        flag: 6,
        roomId: this.data.roomId,
        cleanPepSum: this.data.cps,
        cleanTimeSum: this.data.cts
      },
      success: res => {
        wx.showToast({
          title: '重置成功',
          icon:'success'
        })

        console.log(res)
        wx.hideLoading()
        setTimeout(function () {
          wx.navigateBack()
        }, 1000)
      },
      fail: err => {
        wx.showToast({
          title: '重置失败',
          icon:'error'
        })

        wx.hideLoading()
        console.log('调用失败：', err)

      }
    })
  },
  cpsChange(event) {
    console.log(event);
    this.setData({
      cps: !this.data.cps
    });
  },
  ctsChange(event) {
    console.log(event);
    this.setData({
      cts: !this.data.cts
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  navigateToChair() {
    let roomId = this.data.historyList[0].roomId;
    let chairIndex = this.data.historyList[0].chairIndex;
    wx.navigateTo({
      url: '../chair/chair?roomId=' + roomId + '&chairIndex=' + chairIndex,
    })
  },
  getHistoryList() {
    let len = this.data.historyList.length;
    let num = 15;
    if (len > 10) num = 10;

    wx.cloud.callFunction({
      name: 'getRank',
      data: {
        skip: len,
        num: num,
        roomId: this.data.roomId
      },
      success: res => {
        console.log(res);
        let changeData = res.result.data;
        this.setData({
          historyList: [...this.data.historyList, ...changeData],
        })
      },
      fail: err => {
        console.log('调用失败：', err)
      }
    })

  },
  getIsAdmin() {
    let getState =  setInterval(()=>{
    // console.log(app.globalData.roomAdminList)
    if(app.globalData.responseState){
      app.globalData.roomAdminList.forEach(item => {
        if (item.roomId == this.data.roomId) {
          this.setData({ isOP: true })
        }
      })
      clearInterval(getState)
    } 
  },100)
  
    },
  onLoad: function (options) {
    console.log(getCurrentPages()[getCurrentPages().length - 2].route == "pages/adminRoomList/adminRoomList");
    if (getCurrentPages()[getCurrentPages().length - 2].route == "pages/adminRoomList/adminRoomList") {
      this.setData({ isOP: true })
    }
    this.setData({
      roomId: options.roomId,
      pep: options.pep,
      tim: (options.tim / 60).toFixed(1)
    })
    console.log(options.roomId);
    this.getHistoryList();
    this.getIsAdmin()
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
    this.getHistoryList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})