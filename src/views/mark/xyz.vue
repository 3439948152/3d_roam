<script setup>
import {ref, onMounted, reactive} from 'vue'
import { useStore } from 'vuex';
import * as Cesium from "cesium"
import roam from '@/utils/cesiumCtrl/roam'


const store = useStore()
const { viewer } = store.state

const form = reactive({
  heading: '',
  pitch: '',
  height: '',
  roll: '',

})
let map=2

let move= new roam(viewer,map)

const init=()=>{
  let tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: "http://localhost/chang7chang8fenjie/tileset.json",
      })
  );
  viewer.zoomTo(tileset);
}

const onSubmit = ( )=> {
  move.cance()


  move.free(form.heading,form.pitch,form.roll,form.height)


}

onMounted(()=>{
  init()

})


</script>
<template>
  <operate-box>
    <el-button @click="move.model_1()">漫游</el-button>
    <el-button @click='move.activate("路线1")'>漫游路线1</el-button>
    <el-button @click='move.activate("路线2")'>漫游路线2</el-button>
    <el-button @click="move.des_polyline()">路线消失</el-button>
    <el-button @click="move.change()">第一人称(锁定视角)</el-button>
    <el-button @click="move.cance()">第一人称(自由视角)</el-button>
    <el-button @click="move.handleStart()">开始</el-button>
    <el-button @click="move.handlePause()">暂停</el-button>
    <el-button @click="move.handleStop()">结束</el-button>

    <el-form :model="form" label-width="120px" >

      <el-form-item label="heading">
        <el-slider v-model="form.heading" @click="onSubmit" show-input />
      </el-form-item>
      <el-form-item label="pitch">
        <el-slider v-model="form.pitch" @click="onSubmit" show-input />
      </el-form-item>
      <el-form-item label="roll">
        <el-slider v-model="form.roll" @click="onSubmit" show-input />
      </el-form-item>
      <el-form-item label="height">
        <el-slider v-model="form.height" @click="onSubmit" show-input />
      </el-form-item>

    </el-form>

  </operate-box>
</template>
<style lang='less' scoped>

</style>