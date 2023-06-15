<script setup>
import * as Cesium from 'cesium'
import { useStore } from 'vuex'
import {reactive, ref} from 'vue'
import DrawTool from '@/utils/cesiumCtrl/drawGraphic';

const store = useStore()
const { viewer } = store.state
const drawTool = new DrawTool(viewer)
const form = reactive({
  heading: '',
  pitch: '',
  height: '',
  roll: '',

})
const onSubmit = ( )=> {
  drawTool.cance()
  drawTool.change(form.heading, form.pitch, form.roll, form.height)
}



</script>
<template>
  <operate-box>
    <el-button type='primary' @click='drawTool.activate("Point")'>点</el-button>
    <el-button type='primary' @click='drawTool.activate("Polyline")'>线</el-button>
    <el-button type='primary' @click='drawTool.clearAll()'>清除点(线)</el-button>
    <el-button type='primary' @click='drawTool._model_1()'>模型</el-button>
    <el-button type='primary' @click="drawTool.change(form.heading, form.pitch, form.roll, form.height)">第一人称(锁定视角)</el-button>
    <el-button type='primary' @click="drawTool.cance()">第一人称(自由视角)</el-button>
    <el-button type='primary' @click='drawTool.handleStart()'>开始</el-button>
    <el-button type='primary' @click='drawTool.handlePause()'>暂停</el-button>
    <el-button type='primary' @click='drawTool.handleStop()'>结束</el-button>
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
<style scoped lang='less'>

</style>