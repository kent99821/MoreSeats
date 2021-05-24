// pages/signIn/signIn.js
import {
  $wuxToptips
} from '../../miniprogram_npm/wux-weapp/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  ok: function (e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let n = this.data.name.replace(/(^\s*)|(\s*$)/g, "")
    if (n.length == 0 || n.length > 15) {
      wx.hideLoading()
      $wuxToptips().warn({
        text: '长度限制1~15位字符',
        duration: 2000
      })
      return
    }
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        flag: 3,
        userName: n
      },
      success: res => {
        console.log(res)
        // console.log(res.result.resCode === 200)
        if (res.result.resCode === 200) {
          $wuxToptips().success({
            text: '登记成功',
            duration: 2000
          })
        } else {
          $wuxToptips().warn({
            text: '重复登记或登记失败',
            duration: 2000
          })
        }
        getApp().globalData.isNewGuys = false
        setTimeout(function () {
          wx.navigateBack()
        }, 1000)
      },
      fail: (res) => {
        wx.showToast({
          title: '云开发出现了些问题，请联系管理员排查！',
          icon: "none"
        })
        console.log(res);
      }
    })
  }
})