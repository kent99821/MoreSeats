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
  // 新建用户档案
addUser(){
  // 创建用户档案前端需要传入参数：用户名 userName(string)
    wx.cloud.callFunction({
      name:'getUserInfo',
      data:{
      flag:3,
      // 前端输入的用户名
      userName:"kent",
      },
      success:res=>{
        console.log(res)
      },
      fail:err=>{
        console.log('调用失败：',err)
      }
    })
},
// 更新用户名
updateUser(){
  // 创建用户档案前端需要传入参数：用户名 userName(string)
    wx.cloud.callFunction({
      name:'getUserInfo',
      data:{
      flag:2,
      // 前端修改的用户名
      userName:"kent Norman",
      },
      success:res=>{
        console.log(res)
      },
      fail:err=>{
        console.log('调用失败：',err)
      }
    })
},
//查询用户信息
getInfo(){
  wx.cloud.callFunction({
    name:'getUserInfo',
    data:{
      flag:0
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  })  
},
// 查询学习记录
getHistory(){
  wx.cloud.callFunction({
    name:'getUserInfo',
    data:{
      flag:1,
      skip:5
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},





// signIn签到部分
signIn(){
  wx.cloud.callFunction({
    name:'signIn',
    data:{
    roomId:"123456",
    chairIndex:2,
    roomName:"海大图书馆"
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},





// signOut签退部分
// 用户手动签退
signout(){
  wx.cloud.callFunction({
    name:'signOut',
    data:{
    flag:0,
    roomId:"123456",
    chairIndex:2
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},
// 系统云函数调用
atsignout(){
  wx.cloud.callFunction({
    name:'signOut',
    data:{
    flag:1,
    openId:"oU2sR5EK2DilhkExj2LhgSPHszAQ",
    roomId:"123456",
    chairIndex:2
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},



// adminAction部分
// 新建自习室
addroom(){
  wx.cloud.callFunction({
    name:'adminAction',
    data:{
    flag:0,
    roomName:"自习室1"
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},
// 修改自习室名
updateName(){
  wx.cloud.callFunction({
    name:'adminAction',
    data:{
    flag:1,
    roomId:"847383",
    roomName:"自习室修改1"
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},
})



