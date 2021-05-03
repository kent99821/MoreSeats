

Page({

  data: {
  
  },


  testFunction() {
    wx.cloud.callFunction({
      name: '',
      data: {
       
      },
      success: res => {
        
      },
      fail: err => {
        console.error('调用失败：', err)
      }
    })
  },

})

