// pages/chair/chair.js
import { $wuxDialog, $wuxToptips } from '../../miniprogram_npm/wux-weapp/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId: '',
    chairIndex: '',
    btnType: 0,//下方按钮 0:坐下 1:签退 2:被占用
    show: 0,//中间显示 0:时长 1:事项
    todo: [
      { s: false, c: "123" },
      { s: true, c: "fdasdfsa" },
      { s: false, c: "6c6sa5dxxxxc4" }
    ],
    mapShow: false,
    quotes:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  setTime(){

  },
  deleteCard(e){
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
  trysignIn(){
    wx.cloud.callFunction({
      name:'signIn',
      data:{
      roomId:this.data.roomId,
      chairIndex:this.data.chairIndex,
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
  readyPage(){
    this.getTodoData();
    this.getQuotes()
  },
  onLoad: function (options) {

    this.setData({
      roomId: options.roomId,
      chairIndex: options.chairIndex
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