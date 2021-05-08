// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    userTotalTime: NaN,
    userTotalVal: NaN,

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
          userTotalVal: res.result.data.recordNum
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
      title: '提示',
      content: '密码为8位数字',
      fieldtype: 'number',
      password: !0,
      defaultText: '',
      placeholder: '请输入Wi-Fi密码',
      maxlength: 8,
      onConfirm(e, response) {
        const content = response.length === 8 ? `Wi-Fi密码到手了: ${response}` : `请输入正确的Wi-Fi密码`
        alert(content)
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