// pages/my/my.js
import { $wuxDialog, $wuxToptips } from '../../miniprogram_npm/wux-weapp/index.js'
const { globalData } = getApp()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTotalTime: '',
    userTotalVal: '',
    userName: '',
    isNewGuys: false,
    openId:"XXXXXX"
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
        // console.log(res);
        if (res.result.data.isNewGuys == true) {
          this.setData({
            userTotalTime: NaN,
            userTotalVal: NaN,
            userName: '未注册',
            isNewGuys: res.result.data.isNewGuys
          })

        } else {
          this.setData({
            userTotalTime: res.result.data.sumTime,
            userTotalVal: res.result.data.recordNum,
            userName: res.result.data.userName,
            isNewGuys: res.result.data.isNewGuys,
            openId:res.result.data.openId.slice(-6)
          })
          console.log(res.result.data.roomAdminList);
          getApp().globalData.roomAdminList = res.result.data.roomAdminList;
          // getApp().globalData.roomAdminList = [1,2,3,4]
          console.log(app.globalData.roomAdminList)

        }
      },
      fail: (res) => {
        wx.showToast({
          title: '云开发出现了些问题，请联系管理员排查！',
          icon: "none"
        })
        // console.log(res);
      }
    })

  },

  /*
  查询用户是否已注册
  */
  // checkUser(){
  //   wx.cloud.callFunction({
  //     name: 'getUserInfo',
  //     data: {
  //       flag: 5,
  //     },
  //     success: res => {
  //       console.log(res);
  //       this.setData
  //     },
  //     fail: (res) => {
  //       wx.showToast({
  //         title: '云开发出现了些问题，请联系管理员排查！',
  //         icon: "none"
  //       })
  //       console.log(res);
  //     }
  //   })
  // },



  isNew: function () {
    if (this.data.isNewGuys) {
      $wuxDialog().open({
        resetOnClose: true,
        title: '提示',
        content: '当前用户未登记',
        buttons: [{
          text: '取消',
        },
        {
          text: '前往登记',
          type: 'primary',
          onTap(e) {
            wx.navigateTo({
              url: '../signIn/signIn',
            })
          },
        },
        ],
      })
      return true
    }
  },
  toHsty: function () {
    if (this.isNew()) return
    wx.navigateTo({
      url: '../history/history',
    })
  }, toAdmin: function () {
    if (this.isNew()) return
    wx.navigateTo({
      url: '../adminRoomList/adminRoomList',
    })
  },
  /**
  * 修改姓名
  */
  changeName(e) {
    if (this.isNew()) return
    //判断是不是未注册用户， 未注册用户跳转指注册页面
    let that = this;
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '修改姓名',
      content: '最长16位字符',
      fieldtype: 'text',
      defaultText: '',
      placeholder: that.data.userName,
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
                userName: response.replace(/(^\s*)|(\s*$)/g, "")
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getUserValue();


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.startPullDownRefresh()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserValue()
    wx.stopPullDownRefresh()
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
    wx.stopPullDownRefresh()
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