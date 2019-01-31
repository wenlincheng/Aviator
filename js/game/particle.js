/**
 * Created by Cheng on 2019/1/30
 * 粒子效果
 */

let THREE = require('../../third/three.min')
//let TweenMax = require('../../third/TweenMax')

//let Anime = require('../../third/anime')

export default class Particle {
  constructor(){
    var geom = new THREE.TetrahedronGeometry(3, 0);
    var mat = new THREE.MeshPhongMaterial({
      color: 0x009999,
      shininess: 0,
      specular: 0xffffff,
      flatShading: THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom, mat);

  }
  explode(pos, color, scale, particlesPool){
    var _this = this;
    var _p = this.mesh.parent;
    this.mesh.material.color = new THREE.Color(color);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);
    var targetX = pos.x + (-1 + Math.random() * 2) * 50;
    var targetY = pos.y + (-1 + Math.random() * 2) * 50;
    var speed = .6 + Math.random() * .2;

    // 粒子的动画效果 需要修改 不能使用TweenMax

    
    // 旋转的动画
    //TweenMax.to(this.mesh.rotation, speed, { x: Math.random() * 12, y: Math.random() * 12 });

    // 放大的动画
    //TweenMax.to(this.mesh.scale, speed, { x: .1, y: .1, z: .1 });

    // 位置的动画
    //TweenMax.to(this.mesh.position, speed, {
      //x: targetX, y: targetY, delay: Math.random() * .1, ease: TweenMax.easeOut, onComplete: function () {
         // 从 parent删除粒子
         //if (_p) _p.remove(_this.mesh);
         // 还原粒子的大小
         //_this.mesh.scale.set(1, 1, 1);
         // 放入粒子库 unshift 向数组的开头添加一个或更多元素
         //particlesPool.unshift(_this);
       //}
    //});
  }
}

