// pages/my/my.js
import { $wuxDialog, $wuxToptips } from '../../miniprogram_npm/wux-weapp/index.js'
const { globalData } = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTotalTime: NaN,
    userTotalVal: NaN,
    userName: globalData.userName
  },
  test(e) {
    console.log(e)
  },
  getUserValue() {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        flag: 0,
      },
      success: res => {
        console.log(res);


        this.setData({
          userTotalTime: res.result.data.sumTime,
          userTotalVal: res.result.data.recordNum,
          userName: res.result.data.userName,
        })
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

  /**
   * 修改姓名
   */
  changeName() {
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '修改姓名',
      content: '最长16位字符',
      fieldtype: 'text',
      defaultText: '',
      placeholder: getApp().globalData.userName,
      maxlength: 16,
      onConfirm(e, response) {
        console.log(response.replace(/(^\s*)|(\s*$)/g, "").length);
        if (response.replace(/(^\s*)|(\s*$)/g, "").length !== 0) {
          wx.cloud.callFunction({
            name: 'getUserInfo',
            data: {
              flag: 2,
              userName: response
            },
            success: res => {
              $wuxToptips().success({
                text: '修改成功',
                duration: 3000
              })
              this.getUserValue();
            },
            fail: (res) => {
              wx.showToast({
                title: '云开发出现了些问题，请联系管理员排查！',
                icon: "none"
              })
              console.log(res);
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserValue();
    // console.log('aaaaaaa');

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
    this.getUserValue();
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