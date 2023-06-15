import * as Cesium from "cesium";
import{get_point,get_data} from "../../common/api/index.js";
export default class roam{

    constructor(viewer ,map) {
        this.viewer = viewer;
        this.hander = null; //事件
        this.ployline=null;
        this._dataSource = null; //存储entities
        this.vehicleEntity=null
        this._tempPositions = []; //存储点集合
        this._point=[];
        this.position=[];
        this.start=null;
        this.data=null
        this.url=null;
        this.map=map;

    }
    _clear_all(){
        this.data=null;
        this._tempPositions = []; //存储点集合
        this._point=[];
        this.position=[];
        this.start=null;
        this.url=null;
        this.handleStop()
    }
    activate(drawType){
        switch (drawType){
            case "路线1":{
                this._clear_all()
                let index_1=1
                this.data={
                    map:this.map,
                    index_1:index_1

                }
                this.url="../SampleData/models/GroundVehicle/GroundVehicle.glb"
                this._fly();
                this.draw_polyline();
                break
            }
            case "路线2":{
                this._clear_all()
                let index_1=2
                this.data={
                    map:this.map,
                    index_1:index_1

                }
                this.url="../SampleData/models/CesiumDrone/CesiumDrone.glb"
                this._fly().then(r => {
                    console.log(r)
                });
                this.draw_polyline();
                break
            }
        }
    }

     draw_polyline() {
        console.log('划线')
        // 两个点以上才能绘制成线
        if (this.position.length >= 2) {
            let ployline_entity = this.viewer.entities.add({
                polyline: {
                    positions: new Cesium.Cartesian3.fromDegreesArrayHeights(this.position),
                    // 宽度
                    width: 2,
                    // 线的颜色
                    material: Cesium.Color.RED,
                    // 是否显示
                    show: true
                }
            });
            this.ployline=ployline_entity
        }


    }
    des_polyline(){
        this.viewer.entities.remove(this.ployline)
    }

    /***
     * 漫游模型
     */
    model_1(){
        let start = Cesium.JulianDate.fromDate(new Date());
        this.start=start
        const totalSeconds = this._point.length*5;
        const stop = Cesium.JulianDate.addSeconds(
            start,
            totalSeconds,
            new Cesium.JulianDate()
        );
        this.viewer.clock.shouldAnimate = false;
        this.viewer.clock.startTime = start.clone();
        this.viewer.clock.stopTime = stop.clone();
        this.viewer.clock.currentTime = start.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        //this.viewer.timeline.zoomTo(start, stop);
        let source = this._point;
        let property = new Cesium.SampledPositionProperty();
        for (let i = 0; i < source.length; i++) {
            let time = Cesium.JulianDate.addSeconds(start, Number(source[i].time), new Cesium.JulianDate);
            let position_1 = Cesium.Cartesian3.fromDegrees(Number(source[i].longitude),
                Number(source[i].latitude), Number(source[i].height));
            // 添加位置，和时间对应
            property.addSample(time, position_1);
        }
// Create a path for our vehicle by lerping between two positions.

// Add our vehicle model.
        const vehicleEntity = this.viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: start,
                stop: stop
            })]),
            position: property,
            orientation: new Cesium.VelocityOrientationProperty(property), // Automatically set the vehicle's orientation to the direction it's facing.
            model: {
                uri:this.url,
                runAnimations: false,
                //nodeTransformations: nodeTransformations,
            },
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.YELLOW
                }),

                trailTime: 0,// 设置为0时 模型通过后隐藏path
                width: 10
            },
            label: {
                //text: new Cesium.CallbackProperty(updateSpeedLabel, false),
                font: "20px sans-serif",
                showBackground: true,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                    0.0,
                    100.0
                ),
            },
        });

        this.viewer.trackedEntity = vehicleEntity;
        this.vehicleEntity = vehicleEntity;
        //vehicleEntity.show=false;
        //vehicleEntity.viewFrom = new Cesium.Cartesian3(-10.0, 7.0, 4.0);
        this.viewer.camera.zoomIn(50)

    }

    /**
     * 获取后端点数据，进行遍历
     * @returns {Promise<void>}
     * @private
     */
    async _fly() {
        let thenpromise=get_data(this.data).then(res=>{
            this._tempPositions=res.data
        })
        await thenpromise
        for(let i=0;i<this._tempPositions.length;i++){
            this._point.push(
                {
                    longitude: this._tempPositions[i].lng,
                    latitude: this._tempPositions[i].lat,
                    height: this._tempPositions[i].height,
                    time:5*i
                })
            this.position.push(Number(this._tempPositions[i].lng),
                Number(this._tempPositions[i].lat),
                Number(this._tempPositions[i].height))
        }
    }

    /**
     * 固定视角
     * @private
     */
    _look(){

        let heading=0;
        let pitch=0;
        let roll=0;
        for(let i=1;i<this._tempPositions.length;i++){
            let time = Cesium.JulianDate.addSeconds(this.start, Number(this._point[i].time), new Cesium.JulianDate)
            if(this.viewer.clock.currentTime<=time){
                heading=this._tempPositions[i].heading
                pitch=this._tempPositions[i].pitch
                roll=this._tempPositions[i].roll
                break
            }}
        let center = this.vehicleEntity.position.getValue(this.viewer.clock.currentTime);

        let ellipsoid = this.viewer.scene.globe.ellipsoid
        let cartographic = ellipsoid.cartesianToCartographic(center);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let alt = cartographic.height;
        this.viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lng, lat, alt +5),
            orientation: {
                heading:
                Number(heading),
                pitch:
                    Number(pitch),
                roll:
                    Number(roll)
            }
        })
    }

    /**
     * 前端获取数据调整相机视角
     * @param heading
     * @param pitch
     * @param roll
     * @param height
     * @private
     */
    _look_fun(heading,pitch,roll,height){
        let center = this.vehicleEntity.position.getValue(this.viewer.clock.currentTime);
        let ellipsoid = this.viewer.scene.globe.ellipsoid
        let cartographic = ellipsoid.cartesianToCartographic(center);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let alt = cartographic.height+Number(height);
        this.viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lng, lat, alt ),
            orientation: {
                heading:
                    Number(heading),
                pitch:
                    Number(pitch),
                roll:
                    Number(roll)
            }
        })
    }


    /**
     * 第一人称视角（固定视角）漫游
     */
     change(){

          this.hander=this.viewer.scene.preUpdate.addEventListener( () => {

            this._look()

        });
    }

    /**
     * 第一人称自由视角，鼠标双击脱离视角跟随
     * @param heading
     * @param pitch
     * @param roll
     * @param height
     */
    free(heading,pitch,roll,height){
        this.hander=this.viewer.scene.preUpdate.addEventListener( () => {

            this._look_fun(heading,pitch,roll,height)

        });

    }

    /**
     * 取消事假
     */
    cance(){
      this.hander()

    }

    handleStart(){

        this.viewer.clock.shouldAnimate = true; //开始播放
    };
//结束
    handleStop = () => {
        this.viewer.entities.remove(this.vehicleEntity)
        //this.viewer.clock.currentTime = viewer.clock.startTime; //修改时间轴的当前时间
        //this.viewer.clock.shouldAnimate = false; //暂停播放
    };
// 暂停
    handlePause = () => {

        this.viewer.clock.shouldAnimate = false; //暂停播放
    };







}