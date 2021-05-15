// pages/chair/chair.js
import { $wuxDialog, $wuxToptips } from '../../miniprogram_npm/wux-weapp/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId: '123456',
    chairIndex: 2,
    btnType: 1,//下方按钮 0:坐下 1:签退 2:被占用
    show: 0,//中间显示 0:时长 1:事项
    todo: [
      { s: false, c: "123" },
      { s: true, c: "fdasdfsa" },
      { s: false, c: "6c6sa5dxxxxc4" }
    ],
    mapShow: false,
    quotes:'',
    time: '00:00:00'
    // getTodoBool: false // 是否
  },

  /**
   * 生命周期函数--监听页面加载
   */
  setTime(){
    let a = '21:34:00';
    let getS = (aTime)=>{
      let num = aTime.split(':');
      let totalNum = 0;
      totalNum= parseInt(num[0]*60*60)+ parseInt(num[1]*60)+parseInt(num[2]);
      return totalNum;
    }
    let nowTime = (new Date()).toTimeString().split(' ')[0]
    let  val=  getS(nowTime)- getS(a) 
    let h, m, s;
    h = parseInt(val/(60*60));
    m = parseInt((val-(h*60*60))/(60));
    s = val%60;
    let parseTime= (h)=>{
      return (h<10?('0'+h):(h))
    }
    // console.log(parseTime(h) +":"+ parseTime(m) + ':'+parseTime(s))
    this.setData({
      time: parseTime(h) +":"+ parseTime(m) + ':'+parseTime(s)
    })

  },
  deleteCard(e){
    console.log('et')
    // console.log(e.currentTarget.dataset.index)
    let  todo = this.data.todo;
    let index = e.currentTarget.dataset.index;
    todo.splice(index,1);
    this.setData({
      todo
    });
    wx.setStorageSync('todo', todo)

  },
  editCard(e) {
    console.log(e.currentTarget.dataset.index)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let defaultText = this.data.todo[index].c
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '事项内容',
      // content: '最长16位字符',
      fieldtype: 'text',
      defaultText:defaultText,
      placeholder:that.data.userName,
      maxlength: -1,
      onConfirm(e, response) {
        if (response.replace(/(^\s*)|(\s*$)/g, "").length !== 0) {
          let todo = that.data.todo;
          todo[index].c= response.replace(/(^\s*)|(\s*$)/g, "");
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
  changStatus(e){
    let index = e.currentTarget.dataset.index;
    let todo = this.data.todo;
    // console.log(this.data.todo)
    todo[index].s = !todo[index].s ;
    this.setData({
      todo
    })
    wx.setStorageSync('todo', todo)
  },
  addToDo(e){
    
    let that =this;
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '事项内容',
      // content: '最长16位字符',
      fieldtype: 'text',
      defaultText: '',
      placeholder:that.data.userName,
      maxlength: -1,
      onConfirm(e, response) {
        if (response.replace(/(^\s*)|(\s*$)/g, "").length !== 0) {
          let todo = that.data.todo || [];
          console.log(that.data.todo)
          // todo[todo.length]= {s: false, c:response.replace(/(^\s*)|(\s*$)/g, "") }
          todo.splice(0,0,{s: false, c:response.replace(/(^\s*)|(\s*$)/g, "") })
          console.log(todo)
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

  getTodoData(){
    let todo = (wx.getStorageSync('todo') || this.data.todo);
    this.setData({
      todo
    })
  },
  getQuotes(){
    wx.request({
      url: 'https://v1.hitokoto.cn',
      data: {
        c: 'k',
        encode:'text',
        charset:"utf-8",
        max_length:15
      },
      success:(res)=>{
        this.setData({
          quotes: res.data
        })
        console.log(this.data.quotes)
        console.log(res)
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  trySignIn(){
    console.log(this.data.roomId)
    console.log(this.data.chairIndex)
    wx.cloud.callFunction({
      name:'signIn',
      data:{
      // roomId:this.data.roomId,
      roomId:this.data.roomId,
      chairIndex: this.data.chairIndex,
      // chairIndex:this.data.chairIndex,
      },
      success:res=>{
        console.log(res)
        console.log('这边还要改')
        if(res.result.resCode==200){
          this.setData({
            btnType: 1
          })
        }else if(res.result.resCode==  300){
          this.setData({
            btnType: 2
          })
        }

      },
      fail:err=>{
        console.log('调用失败：',err)
      }
    }) 
  },
  trySignOut(){

    
    wx.cloud.callFunction({
      name: 'signOut',
      data: {
        flag:0,
        chairIndex:this.data.chairIndex,
        roomId : this.data.roomId
      },
      success:(res)=>{
        console.log(res)
        this.setData({
          btnType: 0
        })
      },
      fail: (err)=>{
        console.log(err);
      }
    })
  },
  readyPage(){
    setInterval(()=> this.setTime(),1000);
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data:{
        flag:1,
        skip:0,
        num: 2
      },
      
      success:(res)=>{
        console.log(res)
        if(res.result.data.length>0){
          console.log(res.result.data[0])
          let val =  res.result.data[0];
          if(val.isOver){
            wx.setStorageSync('todo', [])
            console.log('---')
            console.log(wx.getStorageSync('todo'))
            this.getTodoData()
          }else {
            if(this.data.roomId== val.roomId && this.data.chairIndex== val.chairIndex) {
              this.setData({
                btnType: 1
              })
              console.log(res.sTime)
              this.setTime(res.sTime)
              this.getTodoData();
            }
          }
        }
      }
    })

    this.getQuotes();
  },
  onLoad: function (options) {
    this.setData({
      roomId: options.roomId|| this.data.roomId,
      chairIndex: options.chairIndex|| this.data.chairIndex
    })
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
  signIn: function () {

  },
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