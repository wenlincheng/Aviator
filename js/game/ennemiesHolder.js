/**
 * 封装敌人
 * 
 */

let THREE = require('../../third/three.min')
import Ennemy from 'ennemy'
import Coin from 'coin'

var Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  brownDark: 0x23190f,
  pink: 0xF5986E,
  yellow: 0xf4ce93,
  blue: 0x68c3c0,

};

export default class EnnemiesHolder {
  constructor(){
    this.mesh = new THREE.Object3D();
    this.ennemiesInUse = [];

  }
  spawnEnnemies(game, ennemiesPool) {
    var nEnnemies = game.level;

    for (var i = 0; i < nEnnemies; i++) {
      var ennemy;
      if (ennemiesPool.length) {
        ennemy = ennemiesPool.pop();
      } else {
        ennemy = new Ennemy();
      }

      ennemy.angle = -(i * 0.1);
      ennemy.distance = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
      ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle) * ennemy.distance;
      ennemy.mesh.position.x = Math.cos(ennemy.angle) * ennemy.distance;

      this.mesh.add(ennemy.mesh);
      this.ennemiesInUse.push(ennemy);
    }
  }
  // 敌人旋转
  rotateEnnemies(game, deltaTime, airplane, ennemiesPool, particlesHolder, particlesPool, ambientLight){
    var count = 0;
    for (var i = 0; i < this.ennemiesInUse.length; i++) {
      var ennemy = this.ennemiesInUse[i];
      ennemy.angle += game.speed * deltaTime * game.ennemiesSpeed;

      if (ennemy.angle > Math.PI * 2) ennemy.angle -= Math.PI * 2;

      ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle) * ennemy.distance;
      ennemy.mesh.position.x = Math.cos(ennemy.angle) * ennemy.distance;
      ennemy.mesh.rotation.z += Math.random() * .1;
      ennemy.mesh.rotation.y += Math.random() * .1;

      // 飞机与敌人的位置进行比较
      //var globalEnnemyPosition =  ennemy.mesh.localToWorld(new THREE.Vector3());
      var diffPos = airplane.mesh.position.clone().sub(ennemy.mesh.position.clone());
      var d = diffPos.length();
      // 距离小于设置的安全距离
      if (d < game.ennemyDistanceTolerance) {
        // 撞击产生粒子
        particlesHolder.spawnParticles(ennemy.mesh.position.clone(), 15, Colors.red, 3, particlesPool );

        ennemiesPool.unshift(this.ennemiesInUse.splice(i, 1)[0]);
        this.mesh.remove(ennemy.mesh);
        game.planeCollisionSpeedX = 100 * diffPos.x / d;
        game.planeCollisionSpeedY = 100 * diffPos.y / d;
        ambientLight.intensity = 2;

        count ++;
        i--;
      } else if (ennemy.angle > Math.PI) {
        ennemiesPool.unshift(this.ennemiesInUse.splice(i, 1)[0]);
        this.mesh.remove(ennemy.mesh);
        i--;
      }
    }

    return count;

  }

}