/**
 * Created by 张永平 on 2017/8/7.
 */
import PlotTypes from '../Utils/PlotTypes'
import Plots from '../Geometry/index'
class PlotDraw {
  constructor (map, params) {
    if (map && map instanceof ol.Map) {
      this.map = map
    } else {
      throw new Error('传入的不是地图对象！')
    }
    this.options = params || {}
    /**
     * 交互点
     * @type {null}
     */
    this.points = []
    /**
     * 当前标绘工具
     * @type {null}
     */
    this.plot = null
    /**
     * 当前要素
     * @type {null}
     */
    this.feature = null
    /**
     * 标绘类型
     * @type {null}
     */
    this.plotType = null
    /**
     * 当前标绘参数
     * @type {null}
     */
    this.plotParams = null
    /**
     * 当前地图视图
     * @type {Element}
     */
    this.mapViewport = this.map.getViewport()
    /**
     * 地图双击交互
     * @type {null}
     */
    this.dblClickZoomInteraction = null

    /**
     * 绘制OverLay
     * @type {null}
     */
    this.drawOverlay = null

    /**
     *  标绘状态
     * @type {boolean}
     */
    this.plotState = 'start' // start 标绘开始 end 标绘结束

    /**
     * 事件监听器
     * @type {*}
     */
    this.Observable = new ol.Object()

    this.feature = null

    /**
     * 创建图层名称
     * @type {string}
     */
    this.layerName = ((this.options && this.options['layerName']) ? this.options['layerName'] : 'GISPLOTLAYER')

    /**
     * 当前矢量图层
     * @type {*}
     */
    this.drawLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      layerName: this.layerName
    })

    this.map.addLayer(this.drawLayer)
  }

  /**
   * 激活工具
   * @param type
   * @param params
   */
  active (type, params) {
    this.plotType = type
    this.plotParams = params
    this.points = []
    this.plotState = 'start'
    this.map.on('click', this.mapFirstClickHandler, this)
    this.map.on('dblclick', this.mapDblClickHandler, this)
    this.map.on('pointermove', this.onMouseMoveHandler, this)
  }

  /**
   * 地图事件处理
   * 激活工具后第一次点击事件
   * @param event
   */
  mapFirstClickHandler (event) {
    if (this.plotState === 'start') {
      this.points.push(event.coordinate)
      let plotInfo = {
        type: this.plotType,
        points: this.points
      }
      window.sessionStorage.setItem('plot-info', JSON.stringify(plotInfo))
      if (this.plotType === 'Point') {
        this.plot = this.createPlot(this.plotType, this.points, this.plotParams)
        this.feature = this.plot.getPointFeature()
      }
      if (this.plotType === 'Polyline' && this.plotState === 'start') {
        if (this.points.length === 1) {
          this.plot = this.createPlot(this.plotType, this.points, this.plotParams)
          this.feature = this.plot.getLineStringFeature()
        } else {
          // 向要素追加点
          // this.plot.getGeometry().appendCoordinate(event.coordinate)
        }
      }
      if (this.points.length === 1) {
        this.drawLayer.getSource().addFeature(this.feature)
      }
    }
  }

  onMouseMoveHandler (event) {
    if (this.points.length >= 1) {
      let freehand = this.plot.freehand ? this.plot.freehand : false
      if (!freehand && this.plotState === 'start' && this.plotType !== 'Point') {
        this.feature.getGeometry().setCoordinates(this.points.concat([event.coordinate]))
      }
    }
  }

  /**
   * 地图双击事件
   * @param event
   */
  mapDblClickHandler (event) {
    this.plotState = 'end'
    // 停止双击放大地图级别操作 只有每次第一次停止 其他情况下 放大zoom级别方式仍然存在
  }

  /**
   * @param type
   * @param points
   * @param _params
   * @returns {*}
   */
  createPlot (type, points, _params) {
    let params = _params || {}
    switch (type) {
      case PlotTypes.POINT:
        return new Plots.Point(points, params)
      case PlotTypes.POLYLINE:
        return new Plots.Polyline(points, params)
    }
    return null
  }
}
export default PlotDraw
