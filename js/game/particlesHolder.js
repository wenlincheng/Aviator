
/**
 * Created by Cheng on 2019/1/30
 * 粒子封装
 */
let THREE = require('../../third/three.min')
import Particle from './particle'

export default class ParticlesHolder {
  constructor(){
    this.mesh = new THREE.Object3D();
    this.particlesInUse = [];

  }
  spawnParticles(pos, density, color, scale, particlesPool){
    var nPArticles = density;
    for (var i = 0; i < nPArticles; i++) {
      var particle;
      if (particlesPool.length) {
        particle = particlesPool.pop();
      } else {
        particle = new Particle();
      }
      this.mesh.add(particle.mesh);
      particle.mesh.visible = true;
      var _this = this;
      particle.mesh.position.y = pos.y;
      particle.mesh.position.x = pos.x;
      particle.explode(pos, color, scale, particlesPool);
    }

  }

}