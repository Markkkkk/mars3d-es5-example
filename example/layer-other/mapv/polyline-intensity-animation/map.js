////import * as mars3d from "mars3d"

let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
var mapOptions = {
  scene: {
    center: { lat: 29.808307, lng: 110.597446, alt: 7852846, heading: 353, pitch: -86 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录首次创建的map

  Cesium.Resource.fetchText({ url: "//data.mars3d.cn/file/apidemo/qianxi-time.txt" })
    .then(function (json) {
      // 创建Mapv
      createMapvLayer(json)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function createMapvLayer(rs) {
  var data = []
  var timeData = []

  function curive(fromPoint, endPoint, n) {
    var delLng = (endPoint.lng - fromPoint.lng) / n
    var delLat = (endPoint.lat - fromPoint.lat) / n

    for (let i = 0; i < n; i++) {
      var pointNLng = fromPoint.lng + delLng * i
      var pointNLat = fromPoint.lat + delLat * i
      timeData.push({
        geometry: {
          type: "Point",
          coordinates: [pointNLng, pointNLat]
        },
        count: 1,
        time: i
      })
    }
  }

  var items = rs.split("|")
  for (let i = 0; i < items.length; i++) {
    var itemArr = items[i].split(/\n/)
    let cityBegin
    for (let k = 0; k < itemArr.length; k++) {
      if (itemArr[k]) {
        var item = itemArr[k].split(/\t/)
        if (item[0] === "起点城市" || item[0] === "迁出城市") {
          cityBegin = item[1]
        }
        if (item[0] !== "起点城市" || (item[0] !== "迁出城市" && item.length > 1)) {
          var cityCenter1 = this.mapv.utilCityCenter.getCenterByCityName(item[0].replace(/市|省/, ""))
          var cityCenter2 = this.mapv.utilCityCenter.getCenterByCityName(cityBegin.replace(/市|省/, "").trim())
          if (cityCenter1) {
            if (Math.random() > 0.7) {
              curive(cityCenter2, cityCenter1, 50)
            }
            data.push({
              geometry: {
                type: "LineString",
                coordinates: [
                  [cityCenter1.lng, cityCenter1.lat],
                  [cityCenter2.lng, cityCenter2.lat]
                ]
              },
              count: 100 * Math.random()
            })
          }
        }
      }
    }
  }

  var options1 = {
    strokeStyle: "rgba(55, 50, 250, 0.3)",
    globalCompositeOperation: "lighter",
    shadowColor: "rgba(55, 50, 250, 0.5)",
    gradient: {
      0: "rgba(55, 50, 250, 0)",
      1: "rgba(55, 50, 250, 1)"
    },
    lineWidth: 0.2,
    draw: "intensity",
    data: data // 数据
  }
  // 线图层
  var mapVLayer = new mars3d.layer.MapVLayer(options1)
  map.addLayer(mapVLayer)

  var options2 = {
    fillStyle: "rgba(255, 250, 250, 0.9)",
    size: 0.5,
    animation: {
      type: "time",
      stepsRange: {
        start: 0,
        end: 50
      },
      trails: 1,
      duration: 5
    },
    draw: "simple",
    data: timeData // 数据
  }
  // 创建MapV图层 动画图层
  var mapVLayer2 = new mars3d.layer.MapVLayer(options2)
  map.addLayer(mapVLayer2)
}
