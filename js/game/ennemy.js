/**
 * Created by Cheng on 2019/1/30
 *  敌人
 */

let THREE = require('../../third/three.min')
var Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  brownDark: 0x23190f,
  pink: 0xF5986E,
  yellow: 0xf4ce93,
  blue: 0x68c3c0,

};

export default class Ennemy {
  constructor(){
    var geom = new THREE.TetrahedronGeometry(8, 2);
    var mat = new THREE.MeshPhongMaterial({
      color: Colors.red,
      shininess: 0,
      specular: 0xffffff,
      flatShading: THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;

  }
}
