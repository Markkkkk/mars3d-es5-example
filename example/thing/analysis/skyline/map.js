// import * as mars3d from "mars3d"

var map // mars3d.Map三维地图对象
let skyline

var mapOptions = {
  scene: {
    center: { lat: 28.441881, lng: 119.482881, alt: 133, heading: 240, pitch: -2 },
    globe: {
      depthTestAgainstTerrain: true
    }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 加个模型，观看效果更佳
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    type: "3dtiles",
    name: "县城社区",
    url: "//data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    show: true
  })
  map.addLayer(tiles3dLayer)

  skyline = new mars3d.thing.Skyline()
  map.addThing(skyline)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
function onUnmounted() {
  map = null
}

function changeColor() {
  skyline.color = Cesium.Color.fromRandom()
}

function lineWidth(val) {
  skyline.width = val
}

function isVChecked(value) {
  skyline.enabled = value
}
