// pages/testmap/testmap.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting :{
      skew: 0,
      rotate: 0,
      showLocation: false,
      showScale: false,
      
      layerStyle: 1,
      enableZoom: true,
      enableScroll: true,
      enableRotate: false,
      showCompass: false,
      enable3D: false,
      enableOverlooking: false,
      enableSatellite: false,
      enableTraffic: false,
      latitude:  21.26331,
      longitude:  110.33427,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(wx.createMapContext('room',this));
    // wx.createMapContext('room',this)
    // wx.openSetting({
    //   success (res) {
    //     console.log(res.authSetting)
    //   }
    // })
    wx.startLocationUpdateBackground({
      success: (res)=>{
        console.log(res);
      }
    })
    wx.getLocation({
      success: res=>{
        console.log(res)
      }
    })
    wx.authorize({scope: 'scope.userLocationBackground'})
   let  theMap = wx.createMapContext('room',this);
  //  theMap.getCenterLocation({
  //    success:(res) =>{
  //      console.log(res)
  //    }
  //  });

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