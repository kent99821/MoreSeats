// pages/room/room.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: {

    },
    popupShow: false, popupContent: "123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456123456",
    isAdmin: false,
    tabIndex: 1,
    tabChairsIndex: 0,
    chairs: {
      chairNum: 77,
      group: [{
        groupName: "A区",
        groupSize: 7
      }, {
        groupName: "AA区",
        groupSize: 27
      }, {
        groupName: "AAAAA区",
        groupSize: 27
      }, {
        groupName: "ssssssssasdadaasdasdasd",
        groupSize: 50
      }],
      infos: [
        {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: false
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        }, {
          openId: "",
          state: true
        },




      ],
      sitDown: 19,
      type: 1,
      roomId: ''
    },
    chairsStates: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let aId = options.roomId;
    this.setData({
      roomId: aId
    })
    let aName = options.roomName;
    if (options.roomName) {
      save();
    } else {
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
          // this.setData({ value: res.result.data })
          let tabChairsIndex = []
          let lastChairsIndex = 0
          // res.result.data.chairs.group.
          this.data.chairs.group.forEach((item, index) => {
            let temp = item.groupSize + lastChairsIndex
            tabChairsIndex.push({ start: lastChairsIndex, size: item.groupSize, name: item.groupName })
            lastChairsIndex = temp
          });
          // console.log(this.data.chairs.infos.length);
          this.setData({
            tabChairsIndex,
            chairsStates: this.data.chairs.infos
          })
        },
        fail: err => {
          console.log('调用失败：', err)
        }
      })
    }
    
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

  },
  toChair(){
    const chairIndex = e.currentTarget.dataset.chairIndex;
    // console.log(e.currentTarget.dataset.chairIndex);
    wx.navigateTo({
      url: '../chair/chair?roomId='+ this.data.roomId+'&chairIndex='+chairIndex,
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
    this.setData({
      popupShow: true,
    })
  }
})