/**
 * date:2021.05.06
 * author:kent
 * state:finished
 * content:
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
const _ = db.command
let PageData = {
  reCode: 0, //状态码
  find: {}, //查询结果
  result: {}, //原结果
  aresult: {}, //操作后结果
  uresult: {}, //更新的操作结果
  croomId: "", //创建的roomid
  chairsInfo: [], //查询得到的座位情况
  rank: {}, //排行榜

}
//获取六位随机码
function uuid() {
  var chars = '0123456789'.split('');
  var uuid = [],
    i;
  for (i = 0; i < 6; i++) uuid[i] = chars[0 | Math.random() * 10];
  return uuid.join('');
}
// 修改功能: 自习室 公告 开放时段 打卡规则 座位排布
async function update(event, flag) {

  switch (flag) {
    case 1:
      PageData.result = await db.collection('rooms').where({
        roomId: event.roomId
      }).update({
        data: {
          roomName: event.roomName
        }
      })
      break;
    case 2:
      PageData.result = await db.collection('rooms').where({
        roomId: event.roomId
      }).update({
        data: {
          roomNotice: event.roomNotice
        }
      })
      break;
    case 3:
      PageData.result = await db.collection('rooms').where({
        roomId: event.roomId
      }).update({
        data: {
          openTime: event.openTime
        }
      })
      break;
    case 4:
      PageData.result = await db.collection('rooms').where({
        roomId: event.roomId
      }).update({
        data: {
          rule: event.rule
        }
      })
      break;
    case 5:
      var infos = Array(event.chairNum).fill({
        openId: "",
        state: false
      })
      PageData.result = await db.collection('rooms').where({
        roomId: event.roomId
      }).update({
        data: {
          "chairs.type": event.type,
          "chairs.chairNum": event.chairNum,
          "chairs.infos": infos,
          "chairs.group": event.group
        }
      })
      break;



  }
  if (PageData.result.errMsg === "collection.update:ok") {
    PageData.reCode = 200
    return {
      "resCode": PageData.reCode,
      "Msg": "修改成功",
      "data": {
        roomId: event.roomId
      }
    }
  } else {
    PageData.reCode = 405
    return {
      "resCode": PageData.reCode,
      "Msg": "后台接口错误",
      "data": {}
    }
  }
}


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 新建自习室 
  if (event.flag === 0) {
    while (1) {
      PageData.croomId = uuid()
      PageData.result = await db.collection('rooms').where({
        roomId: PageData.croomId
      }).get()
      if (PageData.result.data.length === 0) {
        PageData.aresult = await db.collection('rooms').add({
          data: {
            chairs: {
              infos: [],
              sitDown: 0,
              type: 0,
              chairNum: 0,
              group: []
            },
            count: {
              pepSum: 0,
              timeSum: 0
            },
            isOpen: true,
            openId: wxContext.OPENID,
            openTime: "",
            roomId: PageData.croomId,
            roomName: event.roomName,
            roomNotice: {},
            rule: {
              type: 0,
              size: 0,
              longitude: 0,
              latitude: 0
            }
          }
        })
        // 更新users集合
        PageData.uresult = await db.collection('users').where({
          openId: wxContext.OPENID
        }).update({
          data: {
            isAdmin: true,
            roomAdminList: _.push({
              roomId: PageData.croomId,
              roomName: event.roomName
            })
          }
        })
        if (PageData.aresult.errMsg === "collection.add:ok" && PageData.uresult.errMsg === "collection.update:ok") {
          PageData.reCode = 200
          return {
            "resCode": PageData.reCode,
            "Msg": "创建成功",
            "data": {
              roomId: PageData.croomId,
              roomName: event.roomName
            }
          }
        } else {
          PageData.reCode = 201
          return {
            "resCode": PageData.reCode,
            "Msg": "后台接口错误",
            "data": {}
          }
        }

      }
    }
  } else {
    PageData.find = await db.collection('rooms').where({
      roomId: event.roomId
    }).get()
    if (PageData.find.data.length === 0) {
      PageData.reCode = 404
      return {
        "resCode": PageData.reCode,
        "Msg": "自习室不存在",
        "data": {}
      }
    }
    switch (event.flag) {
      // 修改自习室名
      case 1:
        return update(event, 1)
        // 修改公告
      case 2:
        return update(event, 2)
        // 修改开放时段
      case 3:
        return update(event, 3)
        // 修改打卡规则
      case 4:
        return update(event, 4)
        // 修改座位排布
      case 5:
        return update(event, 5)
        // 排名清零
      case 6:
        // 只清除排名
        if (event.cleanPepSum === false && event.cleanTimeSum === false) {
          PageData.rank = await db.collection('ranks').where({
            roomId: event.roomId
          }).remove()
          if (PageData.rank.errMsg === "collection.remove:ok") {
            PageData.reCode = 200
            return {
              "resCode": PageData.reCode,
              "Msg": "修改成功",
              "data": {
                roomId: event.roomId
              }
            }
          } else {
            PageData.reCode = 405
            return {
              "resCode": PageData.reCode,
              "Msg": "后台接口错误",
              "data": {}
            }
          }
        }

        // return PageData.rank .errMsg: "collection.remove:ok"
        else {
        // 清除排名和总人次 
        if (event.cleanPepSum === true && event.cleanTimeSum === false) {
          // 清除排行榜
          PageData.rank = await db.collection('ranks').where({
            roomId: event.roomId
          }).remove()
          PageData.result = await db.collection('rooms').where({
            roomId: event.roomId
          }).update({
            data: {
              "count.pepSum": 0
            }
          })
        }
        // 清除排名和总时长
        else if (event.cleanPepSum === false && event.cleanTimeSum === true) {
          // 清除排行榜
          PageData.rank = await db.collection('ranks').where({
            roomId: event.roomId
          }).remove()
          PageData.result = await db.collection('rooms').where({
            roomId: event.roomId
          }).update({
            data: {
              "count.timeSum": 0
            }
          })
        }
        // 清除排名 总人次 总时长
        else {
          // 清除排行榜
          PageData.rank = await db.collection('ranks').where({
            roomId: event.roomId
          }).remove()
          PageData.result = await db.collection('rooms').where({
            roomId: event.roomId
          }).update({
            data: {
              "count.pepSum": 0,
              "count.timeSum": 0
            }
          })

        }
          if (PageData.result.errMsg === "collection.update:ok" && PageData.rank.errMsg === "collection.remove:ok") {
            PageData.reCode = 200
            return {
              "resCode": PageData.reCode,
              "Msg": "修改成功",
              "data": {
                roomId: event.roomId
              }
            }
          } else {
            PageData.reCode = 405
            return {
              "resCode": PageData.reCode,
              "Msg": "后台接口错误",
              "data": {}
            }
          }
        }
        //强制清退 只能从前端判别是否成功
        case 7:
          PageData.find = await db.collection('rooms').where({
            roomId: event.roomId
          }).field({
            "chairs.infos": true,
          }).get()
          PageData.chairsInfo = PageData.find.data[0].chairs.infos
          //  对每一个位置进行签退
          for (let i = 0; i < PageData.chairsInfo.length; i++) {
            if (PageData.chairsInfo[i].state === true) {
              cloud.callFunction({
                name: 'signOut',
                data: {
                  flag: 1,
                  openId: PageData.chairsInfo[i].openId,
                  roomId: event.roomId,
                  chairIndex: i
                },
                success: res => {
                  console.log(res)
                },
                fail: err => {
                  console.log('调用失败：', err)
                }
              })
            }

          }
          break;
          // 注销自习室
        case 8:
          PageData.result = await db.collection('rooms').where({
            roomId: event.roomId,
            openId: wxContext.OPENID
          }).remove()
          //return PageData.result.errMsg: "collection.remove:ok"
          PageData.uresult = await db.collection('users').where({
            openId: wxContext.OPENID
          }).update({
            data: {
              roomAdminList: _.pull({
                "roomId": event.roomId
              })
            }
          })
          //return PageData.uresult.errMsg: "collection.update:ok"
          PageData.find = await db.collection('users').where({
            openId: wxContext.OPENID
          }).get()
          if (PageData.find.data[0].roomAdminList.length === 0) {
            PageData.aresult = await db.collection('users').where({
              openId: wxContext.OPENID
            }).update({
              data: {
                isAdmin: false
              }
            })
            if (PageData.result.errMsg === "collection.remove:ok" && PageData.uresult.errMsg === "collection.update:ok" && PageData.aresult.errMsg === "collection.update:ok") {
              PageData.resCode = 200
              return {
                "resCode": PageData.resCode,
                "Msg": "删除成功",
                "data": {}
              }
            } else {
              PageData.resCode = 201
              return {
                "resCode": PageData.resCode,
                "Msg": "删除失败",
                "data": {}
              }
            }
          } else {
            if (PageData.result.errMsg === "collection.remove:ok" && PageData.uresult.errMsg === "collection.update:ok") {
              PageData.resCode = 200
              return {
                "resCode": PageData.resCode,
                "Msg": "删除成功",
                "data": {}
              }
            } else {
              PageData.resCode = 201
              return {
                "resCode": PageData.resCode,
                "Msg": "删除失败",
                "data": {}
              }
            }
          }

    }
  }

}