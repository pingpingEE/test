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

    /**
     * 元素
     * @type {{}}
     */
    this.elementTable = {}
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
   * 初始化提示DOM
   * @returns {boolean}
   */
  initHelperDom () {
    if (!this.map || !this.activePlot) {
      return false
    }
    let parent = this.getMapParentElement()
    if (!parent) {
      return false
    } else {
      let hiddenDiv = this.createHidden('div', parent, 'plot-helper-hidden-div')
      let cPnts = this.getControlPoints()
      if (cPnts && Array.isArray(cPnts) && cPnts.length > 0) {
        cPnts.forEach((item, index) => {
          let id = 'plot-helper-control-point-div' + '-' + index
          // plot-helper-control-point-div 为控制点的样式 设置css
          this.create('div', 'plot-helper-control-point-div', hiddenDiv, id)
          // this.elementTable 用作记录控制点
          this.elementTable[id] = index
        })
      }
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
        // this.addListener(element, 'mousedown', this.controlPointMouseDownHandler, this)
        // this.addListener(element, 'mousemove', this.controlPointMouseMoveHandler2, this)
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
        let plotInfo = JSON.parse(window.sessionStorage.getItem('plot-info'))
        if (plotInfo && plotInfo.points && plotInfo.points.length > 0) {
          points = plotInfo.points
        }
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
    this.initHelperDom()
    this.initControlPoints()
  }

  /**
   * 创建隐藏dom元素  用作添加overlay作准备
   * @param tagName
   * @param parent
   * @param id
   * @returns {Element}
   */
  createHidden (tagName, parent, id) {
    let element = document.createElement(tagName)
    element.style.display = 'none'
    if (id) {
      element.id = id
    }
    if (parent) {
      parent.appendChild(element)
    }
    return element
  }

  /**
   * 根据点创建 多个dom 用作控制点
   * @param tagName
   * @param className
   * @param container
   * @param id
   * @returns {Element}
   */
  create (tagName, className, container, id) {
    let el = document.createElement(tagName)
    el.className = className || ''
    if (id) {
      el.id = id
    }
    if (container) {
      container.appendChild(el)
    }
    return el
  }
  // ol.interaction.DoubleClickZoom  扩展 解决绘制结束 双击zoom级别放大的操作

}
export default PlotEdit
