// pages/room/room.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let aId =  options.roomId;

    let aName = options.roomName ;
    if(options.roomName){
      save();
    }else{
      wx.cloud.callFunction({
        name: 'getRoomInfo',
        data: {
          flag: 1,
          roomId: aId
        },
        success: res => {
          // console.log('----');
          aName = res.result.data.roomName;
          save();
          console.log(res.result.data)
          this.setData({value: res.result.data})

        },
        fail: err => {
          console.log('调用失败：', err)
        }
      })
    }
   
   function save(){
      let val = wx.getStorageSync('rooms');
 
     if(val) {
      val = val.filter((item)=> item.roomId != aId);
      val.splice(0,0, {roomId: aId, roomName: aName})
      val.splice(4);
     }else{
       val = [{roomId: aId, roomName: aName}]
     }
      console.log(val)
      wx.setStorageSync('rooms', val);
    }

    







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