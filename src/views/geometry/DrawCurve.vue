<script setup>
import { reactive } from 'vue'
import {useStore} from "vuex";
const store = useStore()
const { viewer } = store.state
import DrawCurve from '@/utils/cesiumCtrl/DrawCurve'



const move=new DrawCurve(viewer)




</script>
<template>
  <operate-box>
    <el-button @click="move.startCreate()">曲线</el-button>
    <el-button @click="move.draw_polyline()">线</el-button>
    <el-button @click="move.data_point()">保存</el-button>


  </operate-box>
</template>
<style lang='less' scoped>



</style>
