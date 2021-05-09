// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTips:true,

    typeInVisible: false,
    // rooms: [
    //   { "roomId": "123456", "roomName": "海大图书馆", openTime: "7 : 00 ~ 23 : 00", "chairNum": 50, "sitDown": 12 },
    //   { "roomId": "654321", "roomName": "小习室2", openTime: "5:00~12:30", "chairNum": 5, "sitDown": 2 },
    //   { "roomId": "160456", "roomName": "小屋习室3", openTime: "全天开放", "chairNum": 23, "sitDown": 0 },
    //   { "roomId": "120456", "roomName": "黑屋习室4", openTime: "7:00~8:00", "chairNum": 150, "sitDown": 64 }],

    right: [
      {
        text: 'Delete',
        style: 'background-color: #F4333C; color: white',
      }],
      // newGuysORtoChair:false,
      isNewGuys:false,
      isOver: true,
  },



/*
获取用户信息
*/
getUserValue() {
  wx.cloud.callFunction({
    name: 'getUserInfo',
    data: {
      flag: 0,
    },
    success: res => {
      // console.log(res.result.data.isNewGuys);

      if(res.result.data.isNewGuys){
        this.setData({
          isOver: true,
          isNewGuys: true
        })
      }else{
        this.setData({
          isNewGuys: false,
          isOver : res.result.data.isOver
        })
      }
      console.log(this.data.isNewGuys)
      console.log(this.data.isOver)
      // if(res.result.data.isNewGuys || (!res.result.data.isNewGuys&& !res.result.data.isOver)){
      //   this.setData({
      //     showTips: true
      //   })
      // }else{
      //   this.setData({
      //     showTips: false
      //   })
      // }
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

toChair(){
  wx.navigateTo({
    url: '../signIn/signIn',
  })
},


  /*
    获取缓存信息
  */

  getHistory() {


    let val = wx.getStorageSync('rooms');
    console.log(val)

    if (val) {
      //doing something
      val = val.map((item)=>{
        return item.roomId
      })
      console.log(val)
      wx.cloud.callFunction({
        name: 'getRoomInfo',
        data: {
          flag: 0,
          roomIds: ['123456']
        },
        success: res => {
          console.log('-----');
          console.log(res.result.data)

          this.setData({rooms: res.result.data})

        },
        fail: err => {
          console.log('调用失败：', err)
        }
      })
    }
    // this.setData({rooms:val});
    // this.getFireLen();
  },
  getFireLen() {
    let val = this.data.rooms;
    val.forEach((item) => {
      let len = 0;
      if (item.sitDown !== 0)
        len = parseFloat(item.sitDown / item.chairNum);

      if (len == 0) {
        len = 0;
      } else if (len <= 0.3333334) {
        len = 1;
      } else if (len <= 0.6666667) {
        len = 2;
      } else if (len <= 1) {
        len = 3;
      }
      item.len = len;
    })
 
    this.setData({ rooms: val })
  },

  /*
    删除历史某个记录
  */
  deleteCard(e) {

    let index = e.currentTarget.dataset.index;
    let val = this.data.rooms;
    val.splice(index, 1)
    
    let roomsArr = [];
    val.forEach((item) => {
      roomsArr.push({ roomId: item.roomId, roomName: item.roomName });
    })
    // console.log(roomsArr)
    wx.setStorageSync('rooms', roomsArr);
    wx.setStorage({
      data: roomsArr,
      key: 'rooms',
    })
    this.setData({ rooms: val });
  },

  /*
    复制内容
  */
  copyRoomId(e) {
 
    wx.setClipboardData({
      data: e.currentTarget.dataset.roomid,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  /*
  跳转
  */
  toRoom(e) {
    let val = e.currentTarget.dataset.roomid;
    let name = e.currentTarget.dataset.name;
    console.log(val)
    wx.navigateTo({
      url: '/pages/room/room?roomId=' + val + '&roomName=' + name,
    })
  },
  scanQR() {
    let sthis = this;
    wx.scanCode({

      success: (res) => {
        let result = res.result;
        console.log(result)
        // _this.setData({
        // result: result,
        // })
      }
    })
  },

  /**
   * 触发输入
   */
  typeIn(e) {
    console.log(e.detail.value);
    if (e.detail.value.length === 6) {
      wx.navigateTo({
        url: '/pages/room/room?roomId=' + e.detail.value
      })
      this.toTypeInVisible()
    }
  },

  /**
   * 
   */
  toTypeInVisible() {
    this.setData({ typeInVisible: !this.data.typeInVisible })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistory();
    this.getUserValue();
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
    this.getHistory();
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