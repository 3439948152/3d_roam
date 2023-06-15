<script setup>
import * as Cesium from 'cesium'
import { useStore } from 'vuex'
import {onMounted, ref} from 'vue'
import fly_map from '@/utils/cesiumCtrl/fly'
import cesiumDraw from 'cesium-draw'
import 'cesium-draw/dist/theme/default.css'
const store = useStore()
const { viewer } = store.state


const flymap= fly_map(viewer)


</script>
<template>
  <operate-box>

    <el-button type='primary' @click='flymap.col_point()'>点</el-button>
    <el-button type='primary' @click='flymap.fly()'>漫游</el-button>
  </operate-box>
</template>
<style scoped lang='less'>

</style>