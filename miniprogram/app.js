//app.js
App({
  onLaunch: async function () {

    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '自动更新失败',
              content: '新版本已经上线，请手动删除并重新进入以获得新版本体验。'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请手动更新小程序以获得更好体验！'
      })
    }




    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    await wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        flag: 0,
      },
      success: res => {
        console.log(res)
        this.globalData.isNewGuys = res.result.data.isNewGuys
        if (!res.result.data.isNewGuys) {
          this.globalData.roomAdminList = res.result.data.roomAdminList;
          console.log(res.result.data.roomAdminList)
        }
        this.globalData.responseState = true
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
  globalData: {
    roomAdminList: [

    ],
    isNewGuys: false,
    responseState: false
  }
})