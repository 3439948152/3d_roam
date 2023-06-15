
<script setup>
import { reactive } from 'vue'
import {useStore} from "vuex";
const store = useStore()
const { viewer } = store.state
import fly_map from '@/utils/cesiumCtrl/fly'



const move=new fly_map(viewer)

const onSubmit = ( )=> {

  let data=move.draw_polyline()
  console.log(data)
}


</script>
<template>
  <operate-box>
    <el-button @click="move.col_point()">点</el-button>
    <el-button @click="move.draw_polyline()">线</el-button>
    <el-button @click="move.data_point()">保存</el-button>



  </operate-box>
</template>
<style lang='less' scoped>



</style>
