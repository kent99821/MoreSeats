// pages/room/room.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: {

    },
    popupShow: false, popupContent: "",
    isAdmin: false,
    tabIndex: 0,
    tabChairsIndex: 0,
    roomData: {},
    chairsStates: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toAdminRoom() {
    wx.navigateTo({
      url: '../adminRoomList/adminRoomList',
    })
  },
  toRank() {
    wx.navigateTo({
      url: '../rank/rank?roomId' + this.data.roomId + '&pep=123&tim=154234',
    })
  },
  pageInit() {
    let adminList = app.globalData.roomAdminList.map((item) => {
      return item.roomId;
    })
    console.log(adminList)
    let aId = this.data.roomId;
    let aName = "";
    // if (options.roomName) {
    //   save();
    // } else {
    wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 1,
        roomId: aId
      },
      success: res => {
        aName = res.result.data.roomName;
        save();
        console.log(res.result.data)
        // this.setData({ value: res.result.data })
        const roomData = res.result.data;
        let tabChairsIndex = []
        let lastChairsIndex = 0
        // res.result.data.chairs.group.
        // let group = this.data.chairs.group
        let group = res.result.data.chairs.group
        console.log(group)
        this.setData({
          roomData: roomData
        })

        group.forEach((item, index) => {
          let temp = item.groupSize + lastChairsIndex
          // console.log(temp);
          tabChairsIndex.push({ start: lastChairsIndex, size: item.groupSize, name: item.groupName })
          lastChairsIndex = temp
        });
        if (group.length == 0) {
          console.log(666);
          tabChairsIndex = [{
            name: res.result.data.roomName,
            start: 0,
            size: res.result.data.chairs.chairNum
          }]
        }
        // let 
        // for(let i ; i< lastChairsIndex; i++){
        //   chairsStates
        // }
        this.setData({
          tabChairsIndex,
          chairsStates: roomData.chairs.infos
        })
        this.selectComponent('#tabs').resize();
      },
      fail: err => {
        console.log('调用失败：', err)
      }
    })
    // }

    function save() {
      let val = wx.getStorageSync('rooms');
      if (val) {
        val = val.filter((item) => item.roomId != aId);
        val.splice(0, 0, { roomId: aId, roomName: aName })
        val.splice(4);
      } else {
        val = [{ roomId: aId, roomName: aName }]
      }
      console.log(val)
      wx.setStorageSync('rooms', val);
    }
    this.getIsAdmin()


  },
  onLoad: function (options) {
    console.log('参数值')
    let a = wx.getLaunchOptionsSync()
    console.log(a)
    console.log('-----------------')
    console.log(options)
    let aId;
    if (options.scene) {
      aId = options.scene.split('%3D')[1];
    } else {
      aId = options.roomId;
    }

    this.setData({
      roomId: aId
    })
    this.pageInit()
  },
  toChair(e) {
    let chairIndex = e.currentTarget.dataset.chairindex - 1;
    if (this.data.roomData.chairs.infos[chairIndex].state) {
      // chairIndex = chairIndex+1;
      wx.cloud.callFunction({
        name: 'getUserInfo',
        data: {
          flag: 1,
          skip: 0,
          num: 1
        },
        success: (res) => {
          if (res.result.data.length > 0) {
            let val = res.result.data[0];

            if (val.roomId == this.data.roomId && val.chairIndex == chairIndex) {
              wx.navigateTo({
                url: '../chair/chair?roomId=' + val.roomId + '&chairIndex=' + val.chairIndex,
              })
            } else {
              wx.showToast({
                title: '此位置已有人',
                icon: 'error',
              })
            }

          }
        }
      })




    } else {
      wx.navigateTo({
        url: '../chair/chair?roomId=' + this.data.roomId + '&chairIndex=' + chairIndex,
      })
    }
    // console.log(e.currentTarget.dataset.chairindex);

  },
  handleContact(){

  },
  getIsAdmin() {
    console.log(app.globalData.roomAdminList)
    app.globalData.roomAdminList.forEach(item => {
      if (item.roomId == this.data.roomId) {
        this.setData({
          isAdmin: true
        })
      }
    })
  },
  toRank() {
    wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 0,
        roomIds: ['123456']
      },
      success: (res) => {
        console.log(res.result.data[0])
        let roomId = res.result.data[0].roomId;
        let pep = res.result.data[0].count.pepSum;
        let tim = res.result.data[0].count.timeSum;
        wx.navigateTo({
          url: `../rank/rank?roomId=${roomId}&pep=${pep}&tim=${tim}`,
        })
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
    this.pageInit()
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
  /**
   * 左右滑动页面触发
   */
  onSwiperChange: function (e) {
    this.setData({
      tabIndex: e.detail.current
    })
  },
  /**
   * 点击tab触发
   */
  onTabsChange: function (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },
  onClosePopup: function (e) {
    this.setData({
      popupShow: false
    })
  },
  onShowPopup: function (e) {
    console.log(e.currentTarget.dataset.popuptype);
    console.log(this.data.roomData)
    let type = e.currentTarget.dataset.popuptype;
    let popupContent = '';
    if (type == 0) {
      popupContent = this.data.roomData.openTime
    } else if (type == 1) {
      popupContent = this.data.roomData.roomNotice
    } else {
      if (this.data.roomData.rule.type == 0) {
        popupContent = '直接签到'
      } else if (this.data.roomData.rule.type == 1) {
        popupContent = `在'${this.data.roomData.roomName}'的${this.data.roomData.rule.size}m内打卡`
      } else {
        popupContent = '使用人脸验证打卡'
      }

    }

    this.setData({
      popupShow: true,
      popupContent
    })
  }
})