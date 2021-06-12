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
        roomIds: ['123456']
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.error('调用失败：', err)
      }
    })
  },
  //flag(number):1 查询单个自习室具体信息 roomId(string) 
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
  //  //flag(number):2查询单个自习室具体信息 roomId(string) isOver(boolean) 
  getLearn(){
    wx.cloud.callFunction({
      name: 'getRoomInfo',
      data: {
        flag: 2,
        roomId: '454914',
        isOver:true,
        skip:0,
        num:5
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
      skip:0,
      num:10
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},
// 获取用户的openId
appJS(){
  wx.cloud.callFunction({
    name:'getUserInfo',
    data:{
    flag:4
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},
// 获取用户isOver
indexJs(){
  wx.cloud.callFunction({
    name:'getUserInfo',
    data:{
    flag:5
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  })   
},
// 获取用户学习次数 学习总时长 用户名 
myJs(){
  wx.cloud.callFunction({
    name:'getUserInfo',
    data:{
    flag:6
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
    roomId:"729067",
    chairIndex:0,
    roomName:"自习室cesh"
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
    chairIndex:0,
    todo:[{task:"python作业",isFinish:true}]
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
    openId:"oU2sR5Jtl90iGs9zzxFx9mE_lCmQ",
    roomId:"201061",
    chairIndex:1
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
    roomName:"自习室cesh"
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
    roomId:"306674",
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
// 修改自习室公告
updateNotice(){
  wx.cloud.callFunction({
    name:'adminAction',
    data:{
    flag:2,
    roomId:"306674",
    roomNotice:"自习室修改1"
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},
// 修改开放时间
updateOTime(){
  wx.cloud.callFunction({
    name:'adminAction',
    data:{
    flag:3,
    roomId:"306674",
    openTime:"8:00-22:00"
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},
// 修改打卡规则
updateRule(){
  wx.cloud.callFunction({
    name:'adminAction',
    data:{
    flag:4,
    roomId:"306674",
    rule:{
      type:1,
      latitude:32, //纬度
      longitude:32,//经度
      size:100 //范围
    }
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},
// 修改座位排布
updateChair(){
  wx.cloud.callFunction({
    name:'adminAction',
    data:{
    flag:5,
    roomId:"729067",
    type:1,
    chairNum:20,
    group:[
      {
        groupName:"一楼",
        groupSize:10
      },
      {
        groupName:"二楼",
        groupSize:10
      }
    ]
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},
// 清除排名
cleanRank(){
  wx.cloud.callFunction({
    name:'adminAction',
    data:{
    flag:6,
    roomId:"654321",
    cleanPepSum:true,
    cleanTimeSum:false
    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  }) 
},
// 强制清退
forceOut(){
  wx.cloud.callFunction({
    name:'adminAction',
    data:{
    flag:7,
    roomId:"201061",

    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  })
},
// 注销自习室
removeRoom(){
  wx.cloud.callFunction({
    name:'adminAction',
    data:{
    flag:8,
    roomId:"729067",

    },
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log('调用失败：',err)
    }
  })
},

//获取排行榜
getRank(){
  wx.cloud.callFunction({
    name:'getRank',
    data:{
    roomId:"123456",
    skip:0,
    num:10
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





