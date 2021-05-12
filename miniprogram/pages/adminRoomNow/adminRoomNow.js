// pages/adminRoomNow/adminRoomNow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    roomId: ''
  },
  signOut(e){
    console.log(e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index;
    let item = this.data.userList[index];
    console.log(item.openId)
    console.log(this.data.roomId)
    console.log(item.chairIndex)
    wx.cloud.callFunction({
      name:'signOut',
      data:{
      flag:1,
      openId:item.openId,
      roomId:this.data.roomId,
      chairIndex:item.chairIndex
      },
      success:res=>{
        console.log(res)
        let userList = this.data.userList;
        userList.splice(index, 1);
        this.setData({
          userList: userList
        })
      },
      fail:err=>{
        console.log('调用失败：',err)
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    let roomId =  options.roomId
    if(!roomId) roomId = '454914'
    console.log(roomId)
    this.setData({roomId: roomId})
    wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 2,
        roomId: roomId,
        isOver:false,
        skip:0,
        num:5
      },
      success: res => {
        console.log(res)
        let userList = res.result.data;
       userList= userList.map((item)=>{
         let sTime = item.sTime
          item.sTime = sTime.split('T')[0].split('-').join('.')+' '+ sTime.split('T')[1].split('.')[0].split(':')[0]+sTime.split('T')[1].split('.')[0].split(':')[1];
          return item;
        })
        this.setData({
          userList: res.result.data
        })
      },
      fail: err => {
        console.log('调用失败：', err)
      }
    })
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