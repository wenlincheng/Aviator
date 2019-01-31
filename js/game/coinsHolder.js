/**
 * Created by Cheng on 2019/1/30
 *
 */
let THREE = require('../../third/three.min')
import Coin from 'coin'

export default class CoinsHolder {
  constructor(nCoins){
    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];
    this.coinsPool = [];
    for (var i = 0; i < nCoins; i++) {
      var coin = new Coin();
      this.coinsPool.push(coin);
    }

  }
  spawnCoins(game){
    var nCoins = 1 + Math.floor(Math.random() * 10);
    var d = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
    var amplitude = 10 + Math.round(Math.random() * 10);
    for (var i = 0; i < nCoins; i++) {
      var coin;
      if (this.coinsPool.length) {
        coin = this.coinsPool.pop();
      } else {
        coin = new Coin();
      }
      this.mesh.add(coin.mesh);
      this.coinsInUse.push(coin);
      coin.angle = -(i * 0.02);
      coin.distance = d + Math.cos(i * .5) * amplitude;
      coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle) * coin.distance;
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
    }
  }
  rotateCoins(game, deltaTime, airplane, particlesHolder, particlesPool){

    var count = 0;

    for (var i = 0; i < this.coinsInUse.length; i++) {
      var coin = this.coinsInUse[i];
      if (coin.exploding) continue;
      coin.angle += game.speed * deltaTime * game.coinsSpeed;
      if (coin.angle > Math.PI * 2) coin.angle -= Math.PI * 2;
      coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle) * coin.distance;
      coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
      coin.mesh.rotation.z += Math.random() * .1;
      coin.mesh.rotation.y += Math.random() * .1;

      //var globalCoinPosition =  coin.mesh.localToWorld(new THREE.Vector3());
      var diffPos = airplane.mesh.position.clone().sub(coin.mesh.position.clone());
      var d = diffPos.length();
      if (d < game.coinDistanceTolerance) {
        this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
        this.mesh.remove(coin.mesh);
        // 撞击产生粒子
        particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, 0x009999, .8, particlesPool);

        count ++;

        i--;
      } else if (coin.angle > Math.PI) {
        this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
        this.mesh.remove(coin.mesh);
        i--;
      }
    }

    return count;
  }

}