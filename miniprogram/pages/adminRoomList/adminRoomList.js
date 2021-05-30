// pages/adminRoomList/adminRoomList.js
import { $wuxDialog, $wuxToptips } from '../../miniprogram_npm/wux-weapp/index.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomsList: [],
  },


  onLoad0: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        flag: 0,
      },
      success: res => {
        console.log(res.result.data.roomAdminList)
        let val = res.result.data.roomAdminList.map((item) => {
          return item.roomId;
        })
        wx.showLoading({
          title: '加载房间信息',
          mask: true
        })
        wx.cloud.callFunction({
          name: 'getRoomInfo',
          data: {
            flag: 0,
            roomIds: val
          },
          success: res => {
            // console.log('-----');
            // console.log(app.globalData.roomAdminList)
            // console.log(res)
            this.setData({
              roomsList: res.result.data
            })
            wx.hideLoading()
            console.log(this.data.roomsList)
          },
          fail: err => {
            wx.hideLoading()
            console.log('调用失败：', err)
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log('调用失败：', err)
      }
    })

  },
  toCreateRoom() {
    const that = this
    $wuxDialog().prompt({
      resetOnClose: true,
      title: "新建自习室",
      content: '最长16位字符',
      fieldtype: 'text',
      placeholder: "请输入自习室名",
      maxlength: 16,
      onConfirm(e, response) {
        wx.showLoading({
          title: '创建中',
          mask: true
        })
        let n = response.replace(/(^\s*)|(\s*$)/g, "");

        if (n.length !== 0 && n.length < 17) {
          wx.cloud.callFunction({
            name: 'adminAction',
            data: {
              flag: 0,
              roomName: n,
            },
            success: res => {
              that.onLoad0()
              wx.hideLoading()
              wx.showToast({
                title: '创建成功',
                icon: 'success'
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
          wx.showToast({
            title: '新建失败',
            icon:'error'
          })

      },
    })
  },
  deleteItem(e) {
    wx.showLoading({
      title: '删除中',
      mask: true
    })
    let index = e.currentTarget.dataset.index;
    let roomId = this.data.roomsList[index].roomId;
    console.log(roomId);
    wx.cloud.callFunction({
      name: 'adminAction',
      data: {
        flag: 8,
        roomId: roomId,
      },
      success: res => {
        console.log(res)
        wx.hideLoading()

        if(res.result.resCode ==200){
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
          let changeList = this.data.roomsList;
          changeList.splice(index, 1);
          this.setData({
            roomsList: changeList
          })
        }
        else if(res.result.resCode==201){
          wx.showToast({
            title: '删除失败',
            icon:'error',
          })
        }else{
          wx.showToast({
            title: '座位未清退',
            icon: 'error'
          })
        }


      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '删除失败',
          icon:'error'
        })

        console.log('调用失败：', err)
      }
    })
  },
  toadminRoomNow(e) {
    let roomId = e.currentTarget.dataset.roomid;
    wx.navigateTo({
      url: '../adminRoomNow/adminRoomNow?roomId=' + roomId,
    })
  },
  toHistory(e) {
    let roomId = e.currentTarget.dataset.roomid;
    wx.navigateTo({
      url: '../adminRoomHistory/adminRoomHistory?roomId=' + roomId,
    })
  },
  torank(e) {
    let roomId = e.currentTarget.dataset.roomid;
    let pep = e.currentTarget.dataset.pep;
    let tim = e.currentTarget.dataset.tim;
    wx.navigateTo({
      url: `../rank/rank?roomId=${roomId}&pep=${pep}&tim=${tim}`,
    })
  },
  torule(e) {
    let roomId = e.currentTarget.dataset.roomid;
    wx.navigateTo({
      url: '../adminRule/adminRule?roomId=' + roomId,
    })
  },
  tosettingChairs(e) {
    let roomId = e.currentTarget.dataset.roomid;
    wx.navigateTo({
      url: '../adminChairs/adminChairs?roomId=' + roomId,
    })
  },
  changeValue(e) {
    // console.log(e.currentTarget.dataset);
    console.log(e)
    let that = this;
    let type = e.currentTarget.dataset.type;
    let roomId = e.currentTarget.dataset.roomid;
    let changeItem = this.data.roomsList.filter((item) => item.roomId == roomId)
    console.log(changeItem)
    let postData = {};

    // console.log(changeItem)
    console.log(changeItem[0].roomName)
    if (type == 0) {
      postData = {
        title: '修改自习室名字',
        defaultText: changeItem[0].roomName,
        len: 16,
        data: {
          flag: 1,
          roomId: roomId,
        }
      }
    } else if (type == 1) {
      postData = {
        title: '修改开放时间',
        len: 30,
        defaultText: changeItem[0].openTime,
        data: {
          flag: 3,
          roomId: roomId,
        }
      }
    }
    else if (type == 2) {
      postData = {
        title: '修改公告内容',
        len: 100,
        defaultText: changeItem[0].roomNotice,
        data: {
          flag: 2,
          roomId: roomId,
        }
      }
    }

    console.log(postData);
    $wuxDialog().prompt({
      resetOnClose: true,
      title: postData.title,
      fieldtype: 'text',
      defaultText: postData.defaultText,
      content: `最长${postData.len}位字符`,
      maxlength: postData.len,
      onConfirm(e, response) {
        wx.showLoading({
          title: '修改中',
          mask: true
        })
        if (type == 0) postData.data.roomName = response.replace(/(^\s*)|(\s*$)/g, "");
        else if (type == 1) postData.data.openTime = response.replace(/(^\s*)|(\s*$)/g, "");
        else if (type == 2) postData.data.roomNotice = response.replace(/(^\s*)|(\s*$)/g, "");
        if (response.replace(/(^\s*)|(\s*$)/g, "").length !== 0) {
          console.log(postData.data)
          wx.cloud.callFunction({
            name: 'adminAction',
            data: postData.data,
            success: res => {
              let changeList = that.data.roomsList;
              if (type == 0) {
                changeList = changeList.map((item) => {
                  if (item.roomId == roomId) {
                    item.roomName = response.replace(/(^\s*)|(\s*$)/g, "");
                  }
                  return item
                })
              } else if (type == 1) {
                changeList = changeList.map((item) => {
                  if (item.roomId == roomId) {
                    item.openTime = response.replace(/(^\s*)|(\s*$)/g, "");
                  }
                  return item
                })
              }
              else if (type == 2) {
                changeList = changeList.map((item) => {
                  if (item.roomId == roomId) {
                    item.roomNotice = response.replace(/(^\s*)|(\s*$)/g, "");
                  }
                  return item
                })
              }

              that.setData({
                roomsList: changeList
              })
              wx.hideLoading()
              wx.showToast({
                title: '修改成功',
                icon: 'success'
              })
   
            },
            fail: (res) => {
              wx.hideLoading()
              wx.showToast({
                title: '修改失败',
                icon:'error'
              })

              // console.log(res);
            }
          })
        } else
        //失败通知
        {
          wx.hideLoading()
          wx.showToast({
            title: '修改失败',
            icon:'error'
          })
        }
      },
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
    this.onLoad0()
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
  toCard: function (e) {
    let index = e.currentTarget.dataset.index;
    let roomId = this.data.roomsList[index].roomId;
    wx.navigateTo({
      url: `/pages/room/room?roomId=${roomId}`,
    })
  },
  togetQR(e) {
    let roomId = e.currentTarget.dataset.roomid;
    wx.navigateTo({
      url: '../getQR/getQR?roomId=' + roomId,
    })
  },
})