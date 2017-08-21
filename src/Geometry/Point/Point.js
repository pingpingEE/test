/**
 * Created by 张永平 on 2017/8/7.
 * @desc 绘制点
 */
import PlotTypes from '../../Utils/PlotTypes'
const GeomPoint = ol.geom.Point
class Point extends GeomPoint {
  constructor (points, params) {
    super()
    // ol.geom.Point.call(this, [])
    /**
     *  当前要素类型为点
     * @type {string}
     */
    this.type = PlotTypes.POINT
    /**
     * 传输相关参数
     * @type {*}
     */
    this.options = params || {}
    /**
     * 将相关参数 执行 set操作
     */
    this.set('params', this.options)

    /**
     * 当前要素类型
     * @type {null}
     */
    this.pointFeature = null

    this.freehand = false
    /**
     * 开始设置 point 点
     */
    this.tectonicPoint(points)
  }

  tectonicPoint (points) {
    let feature = new ol.Feature({
      geometry: new ol.geom.Point(points[0])
    })
    // 初始化点的样式
    feature.setStyle(this.getStyleByPoint(this.options))
    this.pointFeature = feature
  }

  getStyleByPoint (options) {
    return new ol.style.Style({ // 设置叠加样式
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
          color: 'white'
        }), // 填充颜色
        stroke: new ol.style.Stroke({
          color: 'red',
          size: 5
        })  // 边框颜色
      })
    })
  }

  getPointFeature () {
    return this.pointFeature
  }
}

export default Point
