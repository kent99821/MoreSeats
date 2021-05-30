// pages/adminRoomNow/adminRoomNow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    roomId: ''
  },

  getHistoryList(){
    let len = this.data.userList.length;
    let num = 15;
   
    if (len > 10) num = 10;
    console.log(this.data.roomId)
    wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 2,
        roomId: this.data.roomId,
        isOver: false,
        skip: len,
        num: num
      },
      success: res => {
        console.log(res)
        let userList = res.result.data;
        if (userList.length > 0) {
          userList = userList.map((item) => {
            let sTime = item.ssTime
            item.howlong= getTime((new Date(sTime)).valueOf());

            item.ssTime = sTime.split('T')[0].split('-').join('.') + ' ' + sTime.split('T')[1].split('.')[0].split(':')[0] +":"+ sTime.split('T')[1].split('.')[0].split(':')[1];
            return item;
          })
          this.setData({
            userList: [...this.data.userList,...userList ]
          })
        }

      },
      fail: err => {
        console.log('调用失败：', err)
      }
    })

   function getTime(aTime){

      let a = '21:34:00';
      a = aTime;
      let val = (Date.now()- a)/1000;
 
      return parseInt(val/60);
    //   let h, m, s;
    //   h = parseInt(val/(60*60));
    //   m = parseInt((val-(h*60*60))/(60));
    //   s = parseInt(val%60);
    //   let parseTime= (h)=>{
    //     return (h<10?('0'+h):(h))
    //   }
    //   console.log(parseTime(h) +":"+ parseTime(m) + ':'+parseTime(s))
    //  return  (parseTime(h) +":"+ parseTime(m) + ':'+parseTime(s))/60
  
    }
  },
  signOut(e) {
    console.log(e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index;
    let item = this.data.userList[index];
    console.log(item.openId)
    console.log(this.data.roomId)
    console.log(item.chairIndex)
    wx.cloud.callFunction({
      name: 'signOut',
      data: {
        flag: 1,
        openId: item.openId,
        roomId: this.data.roomId,
        chairIndex: parseInt(item.chairIndex)
      },
      success: res => {
        wx.showToast({
          title: '签退成功',
          icon: 'success'
        })
        console.log(res)
        let userList = this.data.userList;
        userList.splice(index, 1);
        this.setData({
          userList: userList
        })
      },
      fail: err => {
        wx.showToast({
          title: '签退失败',
          icon: 'error'
        })
        console.log('调用失败：', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  clearAll(){
      console.log(this.data.roomId)
      wx.cloud.callFunction({
        name:'adminAction',
        data:{
        flag:7,
        roomId:this.data.roomId,
        },
        success:res=>{
          console.log(res)
          this.setData({
            userList:[]
          })
          wx.showToast({
            title: '清退成功',
            icon: 'success'
          })
        },
        fail:err=>{
          wx.showToast({
            title: '清退失败',
            icon: 'error'
          })
          console.log('调用失败：',err)
        }
      })

  },
   onLoad: function (options) {

    console.log(options)
    let roomId = options.roomId
    // if(!roomId) roomId = '454914'
    console.log(roomId)
    this.setData({ roomId: roomId })
    this.getHistoryList()
    // wx.cloud.callFunction({
    //   name: 'getRoomInfo',
    //   data: {
    //     flag: 2,
    //     roomId: roomId,
    //     isOver: false,
    //     skip: 0,
    //     num: 15
    //   },
    //   success: res => {
    //     console.log(res)
    //     let userList = res.result.data;
    //     if (userList.length > 0) {
    //       userList = userList.map((item) => {
    //         let sTime = item.sTime
    //         item.sTime = sTime.split('T')[0].split('-').join('.') + ' ' + sTime.split('T')[1].split('.')[0].split(':')[0] + sTime.split('T')[1].split('.')[0].split(':')[1];
    //         return item;
    //       })
    //       this.setData({
    //         userList: res.result.data
    //       })
    //     }

    //   },
    //   fail: err => {
    //     console.log('调用失败：', err)
    //   }
    // })
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
    this.getHistoryList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})