// pages/chair/chair.js
import {
  $wuxDialog,
  $wuxToptips
} from '../../miniprogram_npm/wux-weapp/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId: '',
    chairIndex: -1,
    btnType: 0, //下方按钮 0:坐下 1:签退 2:被占用
    show: 0, //中间显示 0:时长 1:事项
    todo: [{
      s: false,
      c: "123"
    },
    {
      s: true,
      c: "fdasdfsa"
    },
    {
      s: false,
      c: "6c6sa5dxxxxc4"
    }
    ],
    mapShow: false,
    quotes: '',
    time: '00:00:00',
    sTime: null,
    // latitude:21.154481,
    // longitude: 110.297833,
    latitude: '',
    longitude: '',
    // getTodoBool: false // 是否
    waitBool: false,
    roomNotice: "",
    rule: {
      latitude: '',
      size: '',
      longitude: '',
      type: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  setTime() {
    if (!this.data.sTime) return;
    let a = '21:34:00';
    a = this.data.sTime;
    let val = (Date.now() - a) / 1000;
    let h, m, s;
    h = parseInt(val / (60 * 60));
    m = parseInt((val - (h * 60 * 60)) / (60));
    s = parseInt(val % 60);
    let parseTime = (h) => {
      return (h < 10 ? ('0' + h) : (h))
    }
    // console.log(parseTime(h) +":"+ parseTime(m) + ':'+parseTime(s))
    this.setData({
      time: parseTime(h) + ":" + parseTime(m) + ':' + parseTime(s)
    })

  },
  // displayMap(){
  //   const query = wx.createSelectorQuery()
  //   query.select('#the-id').boundingClientRect()
  //   query.selectViewport().scrollOffset()
  //   query.exec(function(res){
  //     res[0].top       // #the-id节点的上边界坐标
  //     res[1].scrollTop // 显示区域的竖直滚动位置
  //   })

  //   wx.getLocation({
  //     success: res=>{
  //       console.log(res)
  //       this.setData({
  //         latitude: res.latitude,
  //         longitude: res.longitude
  //       })
  //     }
  //   })
  // },
  deleteCard(e) {
    let todo = this.data.todo;
    let index = e.currentTarget.dataset.index;
    todo.splice(index, 1);
    this.setData({
      todo
    });
    wx.setStorageSync('todo', todo)
  },
  editCard(e) {

    let that = this;
    let index = e.currentTarget.dataset.index;
    let defaultText = this.data.todo[index].c
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '事项内容',
      // content: '最长16位字符',
      fieldtype: 'text',
      defaultText: defaultText,
      placeholder: that.data.userName,
      maxlength: -1,
      onConfirm(e, response) {
        if (response.replace(/(^\s*)|(\s*$)/g, "").length !== 0) {
          let todo = that.data.todo;
          todo[index].c = response.replace(/(^\s*)|(\s*$)/g, "");
          that.setData({
            todo
          })
          wx.setStorageSync('todo', todo)
          $wuxToptips().success({
            text: '修改成功',
            duration: 3000
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
  changStatus(e) {
    let index = e.currentTarget.dataset.index;
    let todo = this.data.todo;
    todo[index].s = !todo[index].s;
    this.setData({
      todo
    })
    wx.setStorageSync('todo', todo)
  },
  addToDo(e) {

    let that = this;
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '事项内容',
      // content: '最长16位字符',
      fieldtype: 'text',
      defaultText: '',
      placeholder: that.data.userName,
      maxlength: -1,
      onConfirm(e, response) {
        if (response.replace(/(^\s*)|(\s*$)/g, "").length !== 0) {
          let todo = that.data.todo || [];

          // todo[todo.length]= {s: false, c:response.replace(/(^\s*)|(\s*$)/g, "") }
          todo.splice(0, 0, {
            s: false,
            c: response.replace(/(^\s*)|(\s*$)/g, "")
          })

          that.setData({
            todo
          })
          wx.setStorageSync('todo', todo)
          $wuxToptips().success({
            text: '添加成功',
            duration: 3000
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

  getTodoData() {
    let todo = (wx.getStorageSync('todo') || this.data.todo);
    this.setData({
      todo
    })
  },
  t: function () {
    console.log(t);
  },
  getQuotes: function () {
    console.log('quotes');
    wx.request({
      url: 'https://v1.hitokoto.cn/?max_length=18encode=text&charset=utf-8&c=d&c=i&c=k&c=e',
      success: (res) => {
        console.log(res);
        this.setData({
          quotes: res.data.hitokoto
        })


      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  trySignIn() {
    console.log(getApp().globalData.isNewGuys);
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (getApp().globalData.isNewGuys) {
      wx.hideLoading()
      $wuxDialog().open({
        resetOnClose: true,
        title: '提示',
        content: '当前用户未登记',
        buttons: [{
          text: '取消',
          onTap(e) {
            $wuxToptips().warn({
              text: '未登记无法坐下',
              duration: 2000
            })
          },
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
      return
    }

    function GetDistance(lat1, lng1, lat2, lng2) {
      var radLat1 = lat1 * Math.PI / 180.0;
      var radLat2 = lat2 * Math.PI / 180.0;
      var a = radLat1 - radLat2;
      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137; // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000;
      return s;
    }
    let out = 0;
    // console.log(this.data.rule)
    if (this.data.rule.type == 1) {
      console.log('位置签到')
      wx.startLocationUpdateBackground({

        success: res => {
          // console.log(res)
          console.log(res)
          console.log('aaaa')
          wx.onLocationChange(
            (res) => {
              // console.log(res)
              console.log('-------')
              console.log(res)
              console.log(this.data.rule)
              let distance = GetDistance(res.latitude, res.longitude, this.data.rule.latitude, this.data.rule.longitude) * 1000;
              console.log(distance)
              if (distance > this.data.rule.size) {
                this.setData({
                  latitude: this.data.rule.latitude,
                  longitude: this.data.rule.longitude,
                  mapShow: true
                })
                wx.hideLoading()
                wx.showToast({
                  title: '不在自习室范围',
                  icon: 'error',
                  duration: 2000
                })
                wx.stopLocationUpdate({
                  success: res => {
                    console.log(res)
                  },
                  fail: err => {
                    console.log(err)
                  }
                })
              } else {
                wx.hideLoading()
                this.signIn();
              }
            }
          )

        },
        fail: res => {
          console.log(res)
          //用户未授权小程序获取地理位置
          wx.hideLoading()
          wx.showModal({
            content:
              "获取地理位置失败！\r\n请前往设置\r\n在小程序期间和离开小程序后\r\n使用您的地理位置",
            showCancel: true, //是否显示取消按钮
            cancelText: "取消", //默认是“取消”
            cancelColor: "#3296fa", //取消文字的颜色
            confirmText: "设置", //默认是“确定”
            confirmColor: "#3296fa", //确定文字的颜色
            success: res => {
              console.log(res)
              if (res.confirm) {
                wx.openSetting({
                  withSubscriptions: true,
                })
              }

              // wx.getSetting({
              //   success: resSetting => {
              //     if (!resSetting.authSetting["scope.userLocation"]) {
              //       wx.openSetting({
              //         success: res => {
              //         }
              //       });
              //     }
              //   }
              // });
            }
          });
        }
      })
    } else {
      wx.hideLoading()
      this.signIn();
    }


  },
  signIn() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'signIn',
      data: {
        // roomId:this.data.roomId,
        roomId: this.data.roomId,
        chairIndex: this.data.chairIndex,
        // chairIndex:this.data.chairIndex,
      },
      success: res => {
        wx.stopLocationUpdate({
          success: res => {
            console.log(res)
          },
          fail: err => {
            console.log(err)
          }
        })
        console.log(res)
        console.log('这边还要改')
        wx.hideLoading()
        if (res.result.resCode == 200) {
          this.setData({
            btnType: 1,
            sTime: new Date()
          })
        } else if (res.result.resCode == 300) {
          this.setData({
            btnType: 2
          })
        }

      },
      fail: err => {
        wx.hideLoading()
        wx.stopLocationUpdate({
          success: res => {
            console.log(res)
          },
          fail: err => {
            console.log(err)
          }
        })
        console.log('调用失败：', err)
      }
    })
  },
  trySignOut() {
    if (this.data.waitBool) return;
    this.setData({
      waitBool: true
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'signOut',
      data: {
        flag: 0,
        chairIndex: this.data.chairIndex,
        roomId: this.data.roomId,
        todo: this.data.todo
      },
      success: (res) => {
        wx.setStorage({
          data: '',
          key: 'todo',
        })
        console.log(res)
        wx.hideLoading()
        this.setData({
          btnType: 0,
          sTime: null,
          time: '00:00:00',
          waitBool: false,
          todo: [],
        })
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },
  readyPage() {
    setInterval(() => this.setTime(), 1000);
    // this.displayMap();
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        flag: 1,
        skip: 0,
        num: 1
      },
      success: (res) => {
        console.log(res)
        if (res.result.data.length > 0) {
          // console.log(res.result.data[0])
          let val = res.result.data[0];
          if (val.isOver) {
            wx.setStorageSync('todo', [])
            // console.log('---')
            // console.log(wx.getStorageSync('todo'))
            this.getTodoData()
          } else {
            if (this.data.roomId == val.roomId && this.data.chairIndex == val.chairIndex) {
              this.setData({
                btnType: 1
              })
              this.setData({
                sTime: (new Date(res.result.data[0].ssTime)).valueOf()
              })
              this.setTime();
              this.getTodoData();
            } else {
              console.log('上次未结束')
              wx.navigateTo({
                url: '../chair/chair?roomId=' + val.roomId + '&chairIndex=' + val.chairIndex,
              })
            }
          }
        }
      }
    })

    this.getQuotes();
  },
  getRoomRule() {
    wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 1,
        roomId: this.data.roomId,
      },
      success: res => {
        console.log(res)
        let rule = res.result.data.rule

        this.setData({
          rule: rule,
          roomNotice: res.result.data.roomNotice
        })
        if (rule.type == 1) {
          this.setData({
            rule: rule,
            latitude: rule.latitude,
            longitude: rule.longitude,
            size: rule.size
          })
        }
        wx.hideLoading()

      },
      fail: err => {
        wx.hideLoading()

        console.log('调用失败：', err)
      }
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log('参数值')
    let a = wx.getLaunchOptionsSync()
    console.log(a)
    console.log('-----------------')
    console.log(options)
    let roomId, chairIndex;
    if (options.scene) {
      console.log(options.scene)
      chairIndex = options.scene.split('%26')[0].split('%3D')[1];
      roomId = options.scene.split('%26')[1].split('%3D')[1];
    } else {
      roomId = options.roomId;
      chairIndex = options.chairIndex;
    }

    wx.setNavigationBarTitle(
      { title: (parseInt(chairIndex) + 1) + ' 号座位 ' }
    )

    this.setData({
      roomId: roomId,
      chairIndex: chairIndex
    })
    this.getRoomRule()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //重新计算公告栏内文字长度以判断是否滚动

    this.selectComponent("#ntc").resetAnimation()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.readyPage()
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
    this.readyPage()
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
   * 切换分段器 
   */
  changeCTL: function (e) {
    console.log(e);
    this.setData({
      show: e.detail.key
    })
  },
  /**
   * 坐下
   */

  /**
   * 签退
   */
  signOut: function () {

  },
  /**
   * 被占用提示
   */
  warningTips: function () {

  },
  /**
   * 关闭地图
   */
  mapClose: function () {
    this.setData({
      mapShow: false
    })
  }
})