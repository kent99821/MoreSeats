// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TR: false,
    C1: false,
    C2: false,
  },
  cTR() {
    this.setData({
      TR: false
    })
  },
  sTR() {
    this.setData({
      TR: true
    })
  },
  cC1() {
    this.setData({
      C1: false
    })
  },
  sC1() {
    this.setData({
      C1: true
    })
  },
  cC2() {
    this.setData({
      C2: false
    })
  },
  sC2() {
    this.setData({
      C2: true
    })
  }

})