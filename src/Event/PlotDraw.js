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
     * 事件监听器
     * @type {*}
     */
    this.Observable = new ol.Object()

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
    this.map.on('click', this.mapFirstClickHandler, this)
  }

  /**
   * 地图事件处理
   * 激活工具后第一次点击事件
   * @param event
   */
  mapFirstClickHandler (event) {
    this.points.push(event.coordinate)
    if (this.plotType === 'Point') {
      this.plot = this.createPlot(this.plotType, this.points, this.plotParams)
    }
    if (this.plotType === 'Polyline') {
      if (this.points.length === 1) {
        this.plot = this.createPlot(this.plotType, this.points, this.plotParams)
      } else {
        // 向要素追加点
        this.plot.getGeometry().appendCoordinate(event.coordinate)
      }
    }
    if (this.points.length === 1) {
      this.drawLayer.getSource().addFeature(this.plot)
    }
  }

  /**
   * 绘制结束
   */
  drawEnd (event) {
    // this.Observable.dispatchEvent({
    //   type: 'drawEnd',
    //   event: event,
    //   feature: this.feature
    // })
    if (this.feature && this.options['isClear']) {
      this.drawLayer.getSource().removeFeature(this.feature)
    }
    this.activateMapTools()
    this.removeEventHandlers()
    this.map.removeOverlay(this.drawOverlay)
    this.points = []
    this.plot = null
    this.plotType = null
    this.plotParams = null
    this.feature = null
  }

  /**
   * 移除事件监听
   */
  removeEventHandlers () {
    this.map.un('click', this.mapFirstClickHandler, this)
    // this.map.un('click', this.mapNextClickHandler, this)
    // Events.unlisten(this.mapViewport, EventType.MOUSEMOVE, this.mapMouseMoveHandler, this)
    // this.map.un('dblclick', this.mapDoubleClickHandler, this)
  }

  /**
   * 激活已取消的地图工具
   * 还原之前状态
   */
  activateMapTools () {
    if (this.dblClickZoomInteraction && this.dblClickZoomInteraction instanceof ol.interaction.DoubleClickZoom) {
      this.map.addInteraction(this.dblClickZoomInteraction)
      this.dblClickZoomInteraction = null
    }
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
        return new Plots.Point(points, params).getPointFeature()
      case PlotTypes.POLYLINE:
        return new Plots.Polyline(points, params).getLineStringFeature()
    }
    return null
  }
}
export default PlotDraw
