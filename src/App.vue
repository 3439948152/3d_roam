
<script setup>
import {onMounted} from "vue"
import store from "@/store/store.js";
import * as Cesium from "cesium"
import roam_fun from "./store/move.js";
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYWE5M2QzNy1hNGFjLTQ3YzItYmU0ZS05MDkyODc1MzVhNzAiLCJpZCI6MTE1MDQwLCJpYXQiOjE2Njg1OTA2NDh9.oW-_utGumUSPqYzlWGjhG8hbda-b4UxZdL0_2t4ASig';

onMounted(() => {
  init()
})
const init = () => {
  const viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox: false,
    timeline: false, // 是否显示时间线控件
    //shouldAnimate: true,
  });
  let tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: "http://localhost/chang6chang7fenjie/tileset.json",
      })
  );
  viewer.terrainProvider = Cesium.createWorldTerrain({
    requestWaterMask: true, // 请求水体效果所需要的海岸线数据
    requestVertexNormals: true, // 请求地形照明数据
  });
  // viewer.scene.setTerrainExaggeration(2.0); // 地形夸张
  viewer.scene.globe.depthTestAgainstTerrain = true; // 启用深度测试，让地形后面的东西消失。
  viewer.scene.globe.enableLighting = true;
  viewer.zoomTo(tileset);
  // 不显示底图
  // viewer.imageryLayers.get(0).show = false;
  // viewer.scene.globe.show = false
  // 去除logo
  viewer.cesiumWidget.creditContainer.style.display = "none"
  // 显示帧率
  viewer.scene.debugShowFramesPerSecond = true;


  // })

  store.commit("initViewer", viewer)

  // 监听点击事件，拾取坐标
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((e) => {
    const clickPosition = viewer.scene.camera.pickEllipsoid(e.position)
    const randiansPos = Cesium.Cartographic.fromCartesian(clickPosition)
    let cartesian = viewer.scene.pickPosition(e.position)
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    console.log("经度：" + Cesium.Math.toDegrees(randiansPos.longitude) + ", 纬度："
        + Cesium.Math.toDegrees(randiansPos.latitude)+',高度：'+cartographic.height)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
</script>

<template>
  <el-container>
    <el-aside>
      <Menu></Menu>
    </el-aside>
    <el-container>
      <el-main>
        <div id="cesiumContainer"></div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
#cesiumContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.el-header {
  height: 30px;
}

.el-container {
  height: 100vh;
}

.el-main {
  padding: 0 !important;
  position: relative;
}

.el-aside {
  width: auto;
}
</style>
