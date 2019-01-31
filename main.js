
/**
 * 主函数 游戏入口
 * 
 * 
 */
let THREE = require('third/three.min')

import UI from 'js/ui'

import AviatorGame from 'js/aviatorGame'
import Params from 'js/params'

// 游戏参数
let GameParams = new Params()

export default class Main{
  constructor(){

    // TODO 不加这一句打开可能会短暂黑屏
    // canvas.getContext('webgl')

    // 渲染器  
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
    this.renderer.shadowMap.enabled = true
    this.renderer.setSize(GameParams.width, GameParams.height)
    this.renderer.setClearColor(0xFFFFFF, 1)
    // 设置设备像素比达到抗锯齿效果
    this.renderer.setPixelRatio(GameParams.ratio)

    // 背景颜色
    this.renderer.setClearColor('rgb(135,206,250)', 1.0);
    this.renderer.setClearColor(0xffffff, 1.0);
    this.renderer.setClearColor('#428bca', 1.0);
    this.renderer.setClearColor('rgba(135,206,250)', 1.0); 

    // 由于使用多个不同的摄像机 这里关闭自动清除
    this.renderer.autoClear = false

    //this.Game = new Game(this.renderer)
    this.AviatorGame = new AviatorGame(this.renderer)
    this.UI = new UI(this.renderer)

    // 显示排行榜
    this.UI.showRanking()

    // setTimeout(() => {
    //   this.UI.hideRanking()
    // }, 6000)

    setInterval(() => {
      this.UI.updateRanking()
    }, 2000)

    wx.onTouchMove(event => {
      this.UI.updateRanking()
    })

    wx.onTouchEnd(event => {
      this.UI.updateRanking()
    })

    this.loop()

  }
  loop() {
    // 关闭了渲染器的自动清除 这里需要手动清除
    this.renderer.clear()

    // 渲染游戏场景
    this.AviatorGame.render()
    // 渲染UI
    this.UI.render()

    window.requestAnimationFrame(this.loop.bind(this), canvas)
  }
}