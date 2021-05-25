import {
  $wuxDialog,
  $wuxToptips
} from '../../miniprogram_npm/wux-weapp/index.js'
// pages/adminRule/adminRule.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    typeName: "平铺",
    group: [],
    newGroup: {
      groupName: "",
      groupSize: 0
    },
    activeTab: 0,
    type: 1,
    chairNum: 0,
    show: false,
    actions: [{
      name: '平铺',
      subname: '适用于小型自习室',
      type: 0
    },
    {
      name: '分组',
      subname: '适用于大型自习室',
      type: 1
    }, {
      name: '平面图（开发中）',
      disabled: true,
      subname: '按真实座位排布显示',
      type: 2
    },
    ],
    roomId: ""
  },
  getConfig: async function (roomId) {
    await wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 1,
        roomId
      },
      success: res => {
        console.log(res.result.data.chairs)
        this.setData({
          ...res.result.data.chairs,
          typeName: this.data.actions.find(i => i.type === res.result.data.chairs.type).name
        })
        this.setData({
          activeTab: this.data.group.length
        })
        if (res.result.data.rule.size === 0) {
          this.setData({
            size: 5
          })
        }
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
  postConfig: async function () {
    wx.showLoading({
      title: '请求中',
      mask: true
    })

    await wx.cloud.callFunction({
      name: 'adminAction',
      data: {
        flag: 5,
        type: this.data.type,
        group: this.data.group,
        chairNum: this.data.chairNum,
        roomId: this.data.roomId
      },
      success: res => {
        console.log(res);
        wx.hideLoading()
        //
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
        console.log(res);
      }
    })
  },
  onSelect: function (e) {
    console.log(e);
    this.setData({
      typeName: e.detail.name,
      show: false,
      type: e.detail.type,
      group: []
    })
  },
  openSelect: function () {
    this.setData({
      show: true
    })
  },
  closeSelect: function () {
    this.setData({
      show: false
    })
  },
  sizeChange: function (e) {
    console.log(e);
    this.setData({
      chairNum: e.detail,
    })
  },
  onTabChange: function (e) {
    console.log(e);
    this.setData({
      activeTab: e.detail,
    })
  },
  onNameChange: function (e) {
    console.log(e);
    this.setData({
      [`group[${this.data.activeTab}].groupName`]: e.detail.value,
    })
  },
  groupSizeChange: function (e) {
    console.log(e);
    this.setData({
      [`group[${this.data.activeTab}].groupSize`]: e.detail,
    })
    this.count()

  },
  onnNameChange: function (e) {
    console.log(e);
    this.setData({
      ['newGroup.groupName']: e.detail.value,
    })
  },
  ngroupSizeChange: function (e) {
    console.log(e);
    this.setData({
      ['newGroup.groupSize']: e.detail,
    })
  },
  newGroup: function (e) {
    // this.data.group.push(this.data.newGroup)
    if (this.data.newGroup.groupName.length == 0) {
      $wuxToptips().warn({
        text: '新建失败，名称不可为空',
        duration: 3000
      })
      return
    }

    this.setData({
      [`group[${this.data.group.length}]`]: this.data.newGroup,
      activeTab: this.data.activeTab + 1
    })
    this.count()

  },
  delGroup: function (e) {
    // this.data.group.push(this.data.newGroup)
    this.data.group.splice(this.data.activeTab, 1)
    this.setData({
      group: this.data.group
    })
    this.count()

  },
  count: function () {
    let sum = 0
    this.data.group.forEach(i => {
      sum += i.groupSize
    })
    this.setData({
      chairNum: sum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      roomId: options.roomId
    })
    this.getConfig(options.roomId)
  },
})