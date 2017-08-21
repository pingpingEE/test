import PlotTypes from '../../Utils/PlotTypes'
class Polyline extends (ol.geom.LineString) {
  constructor (points, params) {
    super()
    ol.geom.LineString.call(this, [])
    /**
     * 当前要素类型为线
     * @type {string}
     */
    this.type = PlotTypes.POLYLINE
    /**
     * 传输相关参数
     * @type {*}
     */
    this.options = params || {}

    /**
     * 要素feature
     * @type {null}
     */
    this.lineStringFeature = null

    this.freehand = false

    /**
     *  标绘线
     */
    this.tectonicLineString(points)
  }

  tectonicLineString (points) {
    let feature = new ol.Feature({
      geometry: new ol.geom.LineString()
    })
    points.forEach((el) => {
      feature.getGeometry().appendCoordinate(el)
    })
    // 初始化点的样式
    feature.setStyle(this.getStyleByLineString(this.options))
    this.lineStringFeature = feature
  }

  getStyleByLineString (options) {
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 4,
        color: '#0000EE'
      })
    })
  }

  /**
   * 获得线的要素信息
   * @returns {ol.Feature|*|null}
   */
  getLineStringFeature () {
    return this.lineStringFeature
  }

  /**
   * 设置坐标点
   * @param value
   */
  setPoints (value) {
    this.points = !value ? [] : value
    if (this.points.length >= 2) {
      this.generate()
    }
  }

  /**
   * 获取坐标点
   * @returns {Array.<T>}
   */
  getPoints () {
    return this.points.slice(0)
  }

  /**
   * 执行动作
   */
  generate () {
    this.setCoordinates(this.points)
  }
}

export default Polyline
