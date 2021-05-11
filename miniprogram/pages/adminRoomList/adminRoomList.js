// pages/adminRoomList/adminRoomList.js
import { $wuxDialog, $wuxToptips } from '../../miniprogram_npm/wux-weapp/index.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomsList :[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let val  = app.globalData.roomAdminList.map((item)=>{
      return  item.roomId;
    })
    console.log(val)
    wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag:0,
        roomIds: val
      },
      success: res => {
        // console.log('-----');
        // console.log(app.globalData.roomAdminList)
        // console.log(res)
        this.setData({
          roomsList: res.result.data
        })
        console.log(this.data.roomsList)
      },
      fail: err => {
        console.log('调用失败：', err)
      }
    })
  },
  toCreateRoom(){
    wx.navigateTo({
      url: '../',
    })
  },

  changeRoomName(){

    let that = this;

      $wuxDialog().prompt({
        resetOnClose: true,
        title: '修改姓名',
        content: '最长16位字符',
        fieldtype: 'text',
        defaultText: '',
        placeholder:that.data.userName,
        maxlength: 16,
        onConfirm(e, response) {
          // console.log(response.replace(/(^\s*)|(\s*$)/g, "").length);
          if (response.replace(/(^\s*)|(\s*$)/g, "").length !== 0) {
            wx.cloud.callFunction({
              name: 'getUserInfo',
              data: {
                flag: 2,
                userName: response.replace(/(^\s*)|(\s*$)/g, "")
              },
              success: res => {
                that.setData({
                  userName:response.replace(/(^\s*)|(\s*$)/g, "")
                })
                $wuxToptips().success({
                  text: '修改成功',
                  duration: 3000
                })
              },
              fail: (res) => {
                wx.showToast({
                  title: '云开发出现了些问题，请联系管理员排查！',
                  icon: "none"
                })
                // console.log(res);
              }
            })
          } else
            //失败通知
            $wuxToptips().warn({
              text: '修改失败',
              duration: 3000
            })
        },
      })
  




      wx.cloud.callFunction({
        name:'adminAction',
        data:{
        flag:1,
        roomId:"306674",
        roomName:"自习室修改1"
        },
        success:res=>{
          console.log(res)
        },
        fail:err=>{
          console.log('调用失败：',err)
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