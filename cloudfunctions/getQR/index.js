const cloud = require('wx-server-sdk')
const JsZip = require('jszip')

cloud.init({
  env: 'cloud1-8gmb0klh8ea93cef'
})

// 云函数入口函数
exports.main = async (event, context) => {

  // event = {
  //   flag,
  //   chairNum,
  //   indexStart,
  //   roomId
  // }
  switch (event.flag) {
    case 0:
      var Azip = JsZip()
      let indexEnd = event.indexStart + event.chairNum
      for (let index = event.indexStart; index < indexEnd; index++) {
        console.log(index);
        let result = await cloud.openapi.wxacode.getUnlimited({
          page: 'pages/chair/chair',
          scene: `chairIndex=${index}&roomId=${event.roomId}`,
          lineColor: { "r": 255, "g": 121, "b": 91 },
          width: 300
        })
        Azip.file(`${index + 1}.jpg`, result.buffer)
      }
      const zip = await Azip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: {
          level: 1
        }
      })
      const rFId = await cloud.uploadFile({
        cloudPath: `qr/room-${event.roomId}_${event.indexStart + 1}-${indexEnd}.zip`,
        fileContent: zip,
      })

      const link = await cloud.getTempFileURL({
        fileList: [rFId.fileID],
      })

      return link.fileList[0]
    case 1:

      return await cloud.openapi.wxacode.getUnlimited({
        page: 'pages/room/room',
        scene: `roomId=${event.roomId}`,
        lineColor: { "r": 255, "g": 121, "b": 91 },
        width: 420
      })
  }

}
