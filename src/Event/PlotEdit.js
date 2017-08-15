/**
 * Created by 张永平 on 2017/8/15.
 */
class PlotEdit {
  constructor (map, params) {
    if (map && map instanceof ol.Map) {
      this.map = map
    } else {
      throw new Error('传入的不是地图对象！')
    }
    this.options = params || {}

    /**
     * 选中要素操作
     * @type {null}
     */
    this.select = null

    /**
     * 是否在要素区域外点击 默认为true 是在要素外单击
     * @type {boolean}
     */
    this.clickout = true

    /**
     * 激活绘制工具
     * @type {null}
     */
    this.activePlot = null
  }

  /**
   * 获取地图元素的父元素
   * @returns {*}
   */
  getMapParentElement () {
    let mapElement = this.map.getTargetElement()
    if (!mapElement) {
      return false
    } else {
      return mapElement.parentNode
    }
  }

  /**
   * 初始化要素控制点
   */
  initControlPoints () {
    this.controlPoints = []
    let cPnts = this.getControlPoints()
    if (cPnts && Array.isArray(cPnts) && cPnts.length > 0) {
      cPnts.forEach((item, index) => {
        let id = 'plot-helper-control-point-div' + '-' + index
        this.elementTable[id] = index
        let element = document.getElementById(id)
        let pnt = new ol.Overlay({
          id: id,
          position: cPnts[index],
          positioning: 'center-center',
          element: element
        })
        this.controlPoints.push(pnt)
        this.map.addOverlay(pnt)
        this.map.render()
        // DomUtil.addListener(element, 'mousedown', this.controlPointMouseDownHandler, this)
        // DomUtil.addListener(element, 'mousemove', this.controlPointMouseMoveHandler2, this)
      })
    }
  }

  /**
   * 获取要素的控制点
   * @returns {Array}
   */
  getControlPoints () {
    let points = []
    if (this.activePlot) {
      let geom = this.activePlot.getGeometry()
      if (geom) {
        points = geom.getClosestPoint()
      }
    }
    return points
  }

  /**
   * 激活工具
   * @param plot
   * @returns {boolean}
   */
  activate (plot) {
    this.activePlot = plot
    this.initControlPoints()
  }
}
export default PlotEdit
