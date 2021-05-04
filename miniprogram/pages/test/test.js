Page({

  data: {

  },

  // 调用getRoomInfo函数部分
  //flag(number):0 查询多个自习室基础信息 roomIds(string array) 
  getRooms() {
    wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 0,
        roomIds: ['123456', '654321']
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.error('调用失败：', err)
      }
    })
  },
  //flag(number):0 查询单个自习室具体信息 roomId(string) 
  getRoom() {
    wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 1,
        roomId: '123456'
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log('调用失败：', err)
      }
    })
  },
  //调用getUserInfo部分
addUser(){
  // 创建用户档案前端需要传入参数：用户名 userName(string)
    wx.cloud.callFunction({
      name:'getUserInfo',
      data:{
      flag:3,
      userName:"kent",
      },
      success:res=>{
        console.log(res)
      },
      fail:err=>{
        console.log('调用失败：',err)
      }
    })
}
})



