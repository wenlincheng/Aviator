
let THREE = require('../third/three.min')
import CoinsHolder from 'game/coinsHolder'
import AirPlane from 'game/airPlane'
import Sea from 'game/sea'
import Sky from 'game/sky'
import Ennemy from 'game/ennemy'
import EnnemiesHolder from 'game/ennemiesHolder'
import Particle from 'game/particle'
import ParticlesHolder from '/game/particlesHolder'
import Music from 'game/music'



// 游戏变量
var game;
var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var ennemiesPool = [];
var particlesPool = [];
var particlesInUse = [];

//three.js相关的变量
var scene;
var camera;
var fieldOfView;
var aspectRatio;
var nearPlane;
var farPlane;
//var renderer;
var container;
var controls;

// 屏幕鼠标变量
var HEIGHT;
var WIDTH;
var mousePos = { x: 0, y: 0 };

// 光照
var ambientLight;
var hemisphereLight;
var shadowLight;

// 创建模型
var sea;
var sky;
var airplane;

// 是否blink能源
var blinkEnergy = false;

// 屏幕数据显示
var fieldDistance;
var energyBar;
var replayMessage;
var fieldLevel;
var levelCircle;

var coinsHolder;
var ennemiesHolder;
var particlesHolder;

// 音乐
var music;

/**
 * 
 * 统一游戏管理
 * 
 * 
 */
export default class AviatorGame {
  constructor(renderer){
    
    // 各种颜色
    this.Colors = {
      red: 0xf25346,
      white: 0xd8d0d1,
      brown: 0x59332e,
      brownDark: 0x23190f,
      pink: 0xF5986E,
      yellow: 0xf4ce93,
      blue: 0x68c3c0,

    };
    this.renderer = renderer;

    
    this.init();

    //window.addEventListener('load', init, false);

  }
  // 游戏重置初始化参数
  resetGame(){
    game = {
      speed: 0,
      initSpeed: .00035,
      baseSpeed: .00035,
      targetBaseSpeed: .00035,
      incrementSpeedByTime: .0000025,
      incrementSpeedByLevel: .000005,
      distanceForSpeedUpdate: 100,
      speedLastUpdate: 0,

      distance: 0,
      ratioSpeedDistance: 50,
      energy: 100,
      ratioSpeedEnergy: 3,

      level: 1,
      levelLastUpdate: 0,
      distanceForLevelUpdate: 1000,

      planeDefaultHeight: 100,
      planeAmpHeight: 80,
      planeAmpWidth: 75,
      planeMoveSensivity: 0.005,
      planeRotXSensivity: 0.0008,
      planeRotZSensivity: 0.0004,
      planeFallSpeed: .001,
      planeMinSpeed: 1.2,
      planeMaxSpeed: 1.6,
      planeSpeed: 0,
      planeCollisionDisplacementX: 0,
      planeCollisionSpeedX: 0,

      planeCollisionDisplacementY: 0,
      planeCollisionSpeedY: 0,

      seaRadius: 600,
      seaLength: 800,
      //seaRotationSpeed:0.006,
      wavesMinAmp: 5,
      wavesMaxAmp: 20,
      wavesMinSpeed: 0.001,
      wavesMaxSpeed: 0.003,

      cameraFarPos: 500,
      cameraNearPos: 150,
      cameraSensivity: 0.002,

      coinDistanceTolerance: 15,
      coinValue: 3,
      coinsSpeed: .5,
      coinLastSpawn: 0,
      distanceForCoinsSpawn: 100,

      ennemyDistanceTolerance: 10,
      ennemyValue: 10,
      ennemiesSpeed: .6,
      ennemyLastSpawn: 0,
      distanceForEnnemiesSpawn: 50,

      status: "playing",
    };
    //fieldLevel.innerHTML = Math.floor(game.level);

  }
  // 初始化three.js、屏幕鼠标事件
  createScene() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = .1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    // 雾
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = game.planeDefaultHeight;
    //camera.lookAt(new THREE.Vector3(0, 400, 0));

    //renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    //renderer.setSize(WIDTH, HEIGHT);

    //renderer.shadowMap.enabled = true;

    //renderer.setClearColor('rgb(135,206,250)', 1.0);
    //renderer.setClearColor(0xffffff, 1.0);
    //renderer.setClearColor('#428bca', 1.0);
    //renderer.setClearColor('rgba(135,206,250)', 1.0); 
    // 用于渲染
    //container = document.getElementById('world');
    //container.appendChild(renderer.domElement);

    //window.addEventListener('resize', handleWindowResize, false);

    /*
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = -Math.PI / 2;
    controls.maxPolarAngle = Math.PI ;

    //controls.noZoom = true;
    //controls.noPan = true;
    //*/
  }
  // 鼠标和屏幕事件
  handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    this.renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  }
  // 鼠标移动
  handleMouseMove(event) {
    var tx = -1 + (event.clientX / WIDTH) * 2;
    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = { x: tx, y: ty };
  }
  // 屏幕触摸移动
  handleTouchMove(event) {
    event.preventDefault();
    var tx = -1 + (event.touches[0].pageX / WIDTH) * 2;
    var ty = 1 - (event.touches[0].pageY / HEIGHT) * 2;
    mousePos = { x: tx, y: ty };
  }
  // 鼠标弹起
  handleMouseUp(event) {
    if (game.status === "waitingReplay") {
      this.resetGame();
      this.hideReplay();
    }
  }
  // 屏幕触摸结束
  handleTouchEnd(event) {
    if (game.status === "waitingReplay") {
      this.resetGame();
      this.hideReplay();
    }
  }
  // 创建光照
  createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    ambientLight = new THREE.AmbientLight(0xdc8874, .5);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 4096;
    shadowLight.shadow.mapSize.height = 4096;

    // 相机辅助
    var ch = new THREE.CameraHelper(shadowLight.shadow.camera);

    //scene.add(ch);
    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(ambientLight);
  }
  // 创建飞机
  createPlane() {
    airplane = new AirPlane(game);
    airplane.mesh.scale.set(.25, .25, .25);
    airplane.mesh.position.y = game.planeDefaultHeight;
    scene.add(airplane.mesh);
  }

  // 创建海洋
  createSea() {
    sea = new Sea(game);
    sea.mesh.position.y = -game.seaRadius;
    scene.add(sea.mesh);
  }

  // 创建天空
  createSky() {
    sky = new Sky(game);
    sky.mesh.position.y = -game.seaRadius;
    scene.add(sky.mesh);
  }

  // 创建能源币
  createCoins() {
    coinsHolder = new CoinsHolder(20);
    scene.add(coinsHolder.mesh)
  }

  // 创建敌人
  createEnnemies() {
    for (var i = 0; i < 10; i++) {
      var ennemy = new Ennemy();
      ennemiesPool.push(ennemy);
    }
    ennemiesHolder = new EnnemiesHolder();
    //ennemiesHolder.mesh.position.y = -game.seaRadius;
    scene.add(ennemiesHolder.mesh)
  }

  // 创建粒子
  createParticles() {
    for (var i = 0; i < 10; i++) {
      var particle = new Particle();
      particlesPool.push(particle);
    }
    particlesHolder = new ParticlesHolder();
    //ennemiesHolder.mesh.position.y = -game.seaRadius;
    scene.add(particlesHolder.mesh)
  }

  // 循环函数
  render() {
    newTime = new Date().getTime();
    deltaTime = newTime - oldTime;
    oldTime = newTime;

    // 游戏状态
    if (game.status === "playing") {

      // 游戏中的背景音乐
      music = new Music();

      // 游戏正在进行
      // 每一百米添加能源币
      if (Math.floor(game.distance) % game.distanceForCoinsSpawn == 0 && Math.floor(game.distance) > game.coinLastSpawn) {
        game.coinLastSpawn = Math.floor(game.distance);
        coinsHolder.spawnCoins(game);
      }

      if (Math.floor(game.distance) % game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate) {
        game.speedLastUpdate = Math.floor(game.distance);
        game.targetBaseSpeed += game.incrementSpeedByTime * deltaTime;
      }


      if (Math.floor(game.distance) % game.distanceForEnnemiesSpawn == 0 && Math.floor(game.distance) > game.ennemyLastSpawn) {
        game.ennemyLastSpawn = Math.floor(game.distance);
        ennemiesHolder.spawnEnnemies(game, ennemiesPool);
      }

      if (Math.floor(game.distance) % game.distanceForLevelUpdate == 0 && Math.floor(game.distance) > game.levelLastUpdate) {
        game.levelLastUpdate = Math.floor(game.distance);
        game.level++;
        // 等级
        //fieldLevel.innerHTML = Math.floor(game.level);

        game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel * game.level
      }

      this.updatePlane();
      this.updateDistance();
      this.updateEnergy();
      game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
      game.speed = game.baseSpeed * game.planeSpeed;

    } else if (game.status === "gameover") {
      // 游戏结束
      game.speed *= .99;
      airplane.mesh.rotation.z += (-Math.PI / 2 - airplane.mesh.rotation.z) * .0002 * deltaTime;
      airplane.mesh.rotation.x += 0.0003 * deltaTime;
      game.planeFallSpeed *= 1.05;
      airplane.mesh.position.y -= game.planeFallSpeed * deltaTime;

      // 当飞机的 y坐标小于 -200 游戏等待重新开始
      if (airplane.mesh.position.y < -200) {
        // 获取飞行距离
        console.log(Math.floor(game.distance));
        this.showReplay();
        game.status = "waitingReplay";

      }
    } else if (game.status === "waitingReplay") {

    }


    airplane.propeller.rotation.x += .2 + game.planeSpeed * deltaTime * .005;
    sea.mesh.rotation.z += game.speed * deltaTime;//*game.seaRotationSpeed;

    if (sea.mesh.rotation.z > 2 * Math.PI) sea.mesh.rotation.z -= 2 * Math.PI;

    ambientLight.intensity += (.5 - ambientLight.intensity) * deltaTime * 0.005;

    // 与能源币接触
    var coinsCount = coinsHolder.rotateCoins(game, deltaTime, airplane, particlesHolder, particlesPool);

    if(coinsCount > 0){
      //console.log(coinsCount)
      // 声音
      music.playShoot();
      this.addEnergy(coinsCount);
    }
    
    // 与敌人接触
    var ennemiesCount = ennemiesHolder.rotateEnnemies(game, deltaTime, airplane, ennemiesPool, particlesHolder, particlesPool, ambientLight);

    if(ennemiesCount > 0){
      // 撞击声
      music.playExplosion();
      this.removeEnergy();
    }

    sky.moveClouds(game, deltaTime);
    sea.moveWaves(deltaTime);

    this.renderer.render(scene, camera);

  }

  // 更新飞行距离显示
  updateDistance() {
    game.distance += game.speed * deltaTime * game.ratioSpeedDistance;
    //fieldDistance.innerHTML = Math.floor(game.distance);
    var d = 502 * (1 - (game.distance % game.distanceForLevelUpdate) / game.distanceForLevelUpdate);
    //levelCircle.setAttribute("stroke-dashoffset", d);

  }
  // 更新飞机能源显示条
  updateEnergy() {
    game.energy -= game.speed * deltaTime * game.ratioSpeedEnergy;
    game.energy = Math.max(0, game.energy);
    //energyBar.style.right = (100 - game.energy) + "%";
    //energyBar.style.backgroundColor = (game.energy < 50) ? "#f25346" : "#68c3c0";

    if (game.energy < 30) {
      //energyBar.style.animationName = "blinking";
    } else {
      //energyBar.style.animationName = "none";
    }

    if (game.energy < 1) {
      game.status = "gameover";
    }
  }

  // 添加能源
  addEnergy(coinsCount) {
    
    game.energy += game.coinValue * coinsCount;
    game.energy = Math.min(game.energy, 100);   
    
  }
  // 减少能源
  removeEnergy() {
    game.energy -= game.ennemyValue;
    game.energy = Math.max(0, game.energy);
  }

  // 更新飞机
  updatePlane() {

    game.planeSpeed = this.normalize(mousePos.x, -.5, .5, game.planeMinSpeed, game.planeMaxSpeed);
    var targetY = this.normalize(mousePos.y, -.75, .75, game.planeDefaultHeight - game.planeAmpHeight, game.planeDefaultHeight + game.planeAmpHeight);
    var targetX = this.normalize(mousePos.x, -1, 1, -game.planeAmpWidth * .7, -game.planeAmpWidth);

    game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
    targetX += game.planeCollisionDisplacementX;

    game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
    targetY += game.planeCollisionDisplacementY;

    airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * deltaTime * game.planeMoveSensivity;
    airplane.mesh.position.x += (targetX - airplane.mesh.position.x) * deltaTime * game.planeMoveSensivity;

    airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * deltaTime * game.planeRotXSensivity;
    airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY) * deltaTime * game.planeRotZSensivity;
    var targetCameraZ = this.normalize(game.planeSpeed, game.planeMinSpeed, game.planeMaxSpeed, game.cameraNearPos, game.cameraFarPos);
    camera.fov = this.normalize(mousePos.x, -1, 1, 40, 80);
    camera.updateProjectionMatrix()
    camera.position.y += (airplane.mesh.position.y - camera.position.y) * deltaTime * game.cameraSensivity;

    game.planeCollisionSpeedX += (0 - game.planeCollisionSpeedX) * deltaTime * 0.03;
    game.planeCollisionDisplacementX += (0 - game.planeCollisionDisplacementX) * deltaTime * 0.01;
    game.planeCollisionSpeedY += (0 - game.planeCollisionSpeedY) * deltaTime * 0.03;
    game.planeCollisionDisplacementY += (0 - game.planeCollisionDisplacementY) * deltaTime * 0.01;

    airplane.pilot.updateHairs(game, deltaTime);
  }

  // 显示重新开始
  showReplay() {
    
    //replayMessage.style.display = "block";


    // var offScreenCanvas = wx.createCanvas()
    // var offContext = offScreenCanvas.getContext('2d')
    // offContext.fillStyle = 'red'
    // offContext.fillRect(0, 0, 100, 100)
    // var screenContext = canvas.getContext('2d')
    // screenContext.drawImage(offScreenCanvas, 0, 0)

  }
  // 隐藏重新开始
  hideReplay() {
    //replayMessage.style.display = "none";
  }

  normalize(v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);
    return tv;
  }
  // 初始化函数
  init(event) {

    // UI
    //fieldDistance = document.getElementById("distValue");
    //energyBar = document.getElementById("energyBar");
    //replayMessage = document.getElementById("replayMessage");
    //fieldLevel = document.getElementById("levelValue");
    //levelCircle = document.getElementById("levelCircleStroke");

    this.resetGame();
    this.createScene();
    this.createLights();
    this.createPlane();
    this.createSea();
    this.createSky();
    this.createCoins();
    this.createEnnemies();
    this.createParticles();

    document.addEventListener('mousemove', this.handleMouseMove, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);
    document.addEventListener('mouseup', this.handleMouseUp, false);
    document.addEventListener('touchend', this.handleTouchEnd, false);

    //this.loop();
  }
}