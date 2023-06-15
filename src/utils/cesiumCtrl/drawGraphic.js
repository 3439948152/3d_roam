
import * as Cesium from "cesium";

export default class DrawTool {
  /**
   * 构造函数
   * @param viewer
   */
  constructor(viewer) {
    this.viewer = viewer;
    this._drawHandler = null; //事件
    this._dataSource = null; //存储entities
    this._tempPositions = []; //存储点集合
    this._mousePos = null; //移动点
    this._drawType = null; //类型
    this.start=null;
    this.vehicleEntity=null;
  }

  /**
   * 激活点线面
   * @param drawType
   */
  activate(drawType) {
    this.clearAll();
    this._drawType = drawType;
    this._dataSource = new Cesium.CustomDataSource("_dataSource");
    this.viewer.dataSources.add(this._dataSource);
    this._registerEvents(); //注册鼠标事件
  }

  /**
   * 注册鼠标事件
   */
  _registerEvents() {
    this._drawHandler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
    );
    this.viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度测试
    switch (this._drawType) {
      case "Point": {
        this._leftClickEventForPoint();

        break;
      }
      case "Polyline": {
        this._leftClickEventForPolyline();
        this._mouseMoveEventForPolyline();
        this._rightClickEventForPolyline();

        break;
      }


    }
  }

  /**
   * 鼠标事件之绘制点的左击事件
   * @private
   */
  _leftClickEventForPoint() {
    this._drawHandler.setInputAction((e) => {
      // this.viewer._element.style.cursor = 'default';
      let p = this.viewer.scene.pickPosition(e.position);
      if (!p) return;
      //手动给他提高50m，也可以取消哈
      let carto_pt = Cesium.Cartographic.fromCartesian(p);
      let p1 = [
        Cesium.Math.toDegrees(carto_pt.longitude),
        Cesium.Math.toDegrees(carto_pt.latitude),
        carto_pt.height,
      ];
      this._addPoint(p1);
      this._tempPositions.push(p1)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * 鼠标事件之绘制线的左击事件
   * @private
   */
  _leftClickEventForPolyline() {
    this._drawHandler.setInputAction((e) => {
      let p = this.viewer.scene.pickPosition(e.position);
      if (!p) return;
      this._tempPositions.push(p);
      this._addPolyline();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * 鼠标事件之绘制线的移动事件
   * @private
   */
  _mouseMoveEventForPolyline() {
    this._drawHandler.setInputAction((e) => {
      console.log(e)
      let p = this.viewer.scene.pickPosition(e.endPosition);
      if (!p) return;
      this._mousePos = p;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   * 鼠标事件之绘制线的右击事件
   * @private
   */
  _rightClickEventForPolyline() {
    this._drawHandler.setInputAction((e) => {
      let p = this.viewer.scene.pickPosition(e.position);
      if (!p) return;

      this._removeAllEvent();
      this._dataSource.entities.removeAll();
      this._dataSource.entities.add({
        polyline: {
          positions: this._tempPositions,
          clampToGround: true, //贴地
          width: 3,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
          }),
          depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.YELLOW,
          }),
        },
      });
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }


  /**
   * 移除所有鼠标事件
   * @private
   */
  _removeAllEvent() {
    this._drawHandler &&
    (this._drawHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
    ),
        this._drawHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        ),
        this._drawHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.RIGHT_CLICK
        ),
        this._drawHandler.destroy(),
        (this._drawHandler = null));
  }

  /**
   * 重置所有参数
   * @private
   */
  _resetParams() {
    if (this._dataSource != null) {
      this._dataSource.entities.removeAll();
      this.viewer.dataSources.remove(this._dataSource);
    }
    this._dataSource = null;
    this._tempPositions = [];
    this._mousePos = null;
    this._drawType = null;
  }

  /**
   * 清除
   */
  clearAll() {
    this._removeAllEvent();
    this._resetParams();
  }

  /**
   * 画点
   * @param p
   * @private
   */
  _addPoint(p) {
    this._dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(p[0], p[1], p[2]),
      point: {
        color: Cesium.Color.RED,
        pixelSize: 10,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 2,
        // heightReference:Cesium.HeightReference.CLAMP_TO_GROUND
      },
    });
  }

  /**
   * 画线
   * @private
   */
  _addPolyline() {
    this._dataSource.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          let c = Array.from(this._tempPositions);
          if (this._mousePos) {
            c.push(this._mousePos);
          }
          return c;
        }, false),
        clampToGround: true, //贴地
        width: 3,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW,
        }),
        depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW,
        }),
      },
    });
  }

  _model_1(){
    console.log(this._tempPositions)
    let start = Cesium.JulianDate.fromDate(new Date());
    this.start=start
    const totalSeconds = this._tempPositions.length*5;
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
    let source = this._tempPositions;
    let property = new Cesium.SampledPositionProperty();
    for (let i = 0; i < source.length; i++) {
      let time = Cesium.JulianDate.addSeconds(start, Number(i*5), new Cesium.JulianDate);
      let position_1 = source[i];
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
        uri: "../SampleData/models/GroundVehicle/GroundVehicle.glb",
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

  _look_fun(heading,pitch,roll,height){
    let center = this.vehicleEntity.position.getValue(this.viewer.clock.currentTime);

    let ellipsoid = this.viewer.scene.globe.ellipsoid
    let cartographic = ellipsoid.cartesianToCartographic(center);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    let alt = cartographic.height+Number(height);



    this.viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(lng, lat, alt+5 ),
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
  change(heading,pitch,roll,height){

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



}
