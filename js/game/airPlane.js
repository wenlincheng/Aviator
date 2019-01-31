/**
 * Created by Cheng on 2019/1/30
 * 飞机
 */
let THREE = require('../../third/three.min')
import Pilot from './pilot'

var Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  brownDark: 0x23190f,
  pink: 0xF5986E,
  yellow: 0xf4ce93,
  blue: 0x68c3c0,

};

export default class AirPlane {
  constructor(){
    this.mesh = new THREE.Object3D();
    this.mesh.name = "airPlane";

    // 舱

    var geomCabin = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
    var matCabin = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: THREE.FlatShading
    });

    geomCabin.vertices[4].y -= 10;
    geomCabin.vertices[4].z += 20;
    geomCabin.vertices[5].y -= 10;
    geomCabin.vertices[5].z -= 20;
    geomCabin.vertices[6].y += 30;
    geomCabin.vertices[6].z += 20;
    geomCabin.vertices[7].y += 30;
    geomCabin.vertices[7].z -= 20;

    var cabin = new THREE.Mesh(geomCabin, matCabin);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    this.mesh.add(cabin);

    // 引擎

    var geomEngine = new THREE.BoxBufferGeometry(20, 50, 50, 1, 1, 1);
    var matEngine = new THREE.MeshPhongMaterial({
      color: Colors.white,
      flatShading: THREE.FlatShading
    });
    var engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 50;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // 尾翼
    var geomTailPlane = new THREE.BoxBufferGeometry(15, 20, 5, 1, 1, 1);
    var matTailPlane = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: THREE.FlatShading
    });
    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-40, 20, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // 机翼

    var geomSideWing = new THREE.BoxBufferGeometry(30, 5, 120, 1, 1, 1);
    var matSideWing = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: THREE.FlatShading
    });
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.position.set(0, 15, 0);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);

    var geomWindshield = new THREE.BoxBufferGeometry(3, 15, 20, 1, 1, 1);
    var matWindshield = new THREE.MeshPhongMaterial({
      color: Colors.white,
      transparent: true,
      opacity: .3,
      flatShading: THREE.FlatShading
    });
    var windshield = new THREE.Mesh(geomWindshield, matWindshield);
    windshield.position.set(5, 27, 0);

    windshield.castShadow = true;
    windshield.receiveShadow = true;

    this.mesh.add(windshield);

    var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    geomPropeller.vertices[4].y -= 5;
    geomPropeller.vertices[4].z += 5;
    geomPropeller.vertices[5].y -= 5;
    geomPropeller.vertices[5].z -= 5;
    geomPropeller.vertices[6].y += 5;
    geomPropeller.vertices[6].z += 5;
    geomPropeller.vertices[7].y += 5;
    geomPropeller.vertices[7].z -= 5;
    var matPropeller = new THREE.MeshPhongMaterial({
      color: Colors.brown,
      flatShading: THREE.FlatShading
    });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);

    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    var geomBlade = new THREE.BoxBufferGeometry(1, 80, 10, 1, 1, 1);
    var matBlade = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      flatShading: THREE.FlatShading
    });
    var blade1 = new THREE.Mesh(geomBlade, matBlade);
    blade1.position.set(8, 0, 0);

    blade1.castShadow = true;
    blade1.receiveShadow = true;

    var blade2 = blade1.clone();
    blade2.rotation.x = Math.PI / 2;

    blade2.castShadow = true;
    blade2.receiveShadow = true;

    this.propeller.add(blade1);
    this.propeller.add(blade2);
    this.propeller.position.set(60, 0, 0);
    this.mesh.add(this.propeller);

    var wheelProtecGeom = new THREE.BoxBufferGeometry(30, 15, 10, 1, 1, 1);
    var wheelProtecMat = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: THREE.FlatShading
    });
    var wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
    wheelProtecR.position.set(25, -20, 25);
    this.mesh.add(wheelProtecR);

    var wheelTireGeom = new THREE.BoxBufferGeometry(24, 24, 4);
    var wheelTireMat = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      flatShading: THREE.FlatShading
    });
    var wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat);
    wheelTireR.position.set(25, -28, 25);

    var wheelAxisGeom = new THREE.BoxBufferGeometry(10, 10, 6);
    var wheelAxisMat = new THREE.MeshPhongMaterial({
      color: Colors.brown,
      flatShading: THREE.FlatShading
    });
    var wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
    wheelTireR.add(wheelAxis);

    this.mesh.add(wheelTireR);

    var wheelProtecL = wheelProtecR.clone();
    wheelProtecL.position.z = -wheelProtecR.position.z;
    this.mesh.add(wheelProtecL);

    var wheelTireL = wheelTireR.clone();
    wheelTireL.position.z = -wheelTireR.position.z;
    this.mesh.add(wheelTireL);

    var wheelTireB = wheelTireR.clone();
    wheelTireB.scale.set(.5, .5, .5);
    wheelTireB.position.set(-35, -5, 0);
    this.mesh.add(wheelTireB);

    var suspensionGeom = new THREE.BoxBufferGeometry(4, 20, 4);
    suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 10, 0))
    var suspensionMat = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: THREE.FlatShading
    });
    var suspension = new THREE.Mesh(suspensionGeom, suspensionMat);
    suspension.position.set(-35, -5, 0);
    suspension.rotation.z = -.3;
    this.mesh.add(suspension);

    this.pilot = new Pilot();
    this.pilot.mesh.position.set(-10, 27, 0);
    this.mesh.add(this.pilot.mesh);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

  }

}