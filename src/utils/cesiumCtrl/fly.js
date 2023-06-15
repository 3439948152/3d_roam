import * as Cesium from "cesium";

import{map_point} from "../../common/api/index.js";
export default class fly_map {

    constructor(viewer) {
        this.viewer = viewer;
        this._drawHandler = null; //事件
        this._dataSource = null; //存储entities
        this._tempPositions = []; //存储点集合
        this._point=[];
        this.index=0;
        this.index_2=0;
    }
    col_point(){
        this._drawHandler = new Cesium.ScreenSpaceEventHandler(
            this.viewer.scene.canvas
        );
        console.log('开始')

        let longitude=0
        let latitude=0
        let height=0

        this._drawHandler.setInputAction((evt)=> {

            if (this.viewer.scene.mode !== Cesium.SceneMode.MORPHING) {
                let pickedObject = this.viewer.scene.pick(evt.position);
                if (this.viewer.scene.pickPositionSupported && Cesium.defined(pickedObject)) {
                    let cartesian = this.viewer.scene.pickPosition(evt.position);
                    if (Cesium.defined(cartesian)) {
                        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        let lng = Cesium.Math.toDegrees(cartographic.longitude);
                        let lat = Cesium.Math.toDegrees(cartographic.latitude);
                        let height = cartographic.height;//模型高度



                        this._tempPositions.push(
                            lng, lat, height
                        )
                        this._point.push({
                            lng: lng,
                            lat: lat,
                            height: height,
                            heading: this.viewer.camera.heading,
                            pitch: this.viewer.camera.pitch,
                            roll: this.viewer.camera.roll,
                            duration: 15,
                            map:2,
                            index_1:1,
                            index_2:this.index_2
                        });
                        this.index_2++


                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        return{
        longitude, latitude,height
    }

    }
    data_point(){

        let point=this._point
        console.log(point)
        map_point(point).then(res=>{
            console.log(res);
        })


        return{
            point
        }
    }


    draw_polyline() {

        console.log(this._tempPositions)
        // 两个点以上才能绘制成线
        if (this._tempPositions.length >= 2) {
            let polyline_point_entity = this.viewer.entities.add({
                polyline: {
                    positions: new Cesium.Cartesian3.fromDegreesArrayHeights(this._tempPositions),
                    // 宽度
                    width: 2,
                    // 线的颜色
                    material: Cesium.Color.RED,
                    // 是否显示
                    show: true
                }
            });
        }
    }

    fly(){


    }

}

