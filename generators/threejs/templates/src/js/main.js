'use strict';

var Stats = require('stats-js');
var THREE = require('three');

var stats;
var scene, camera, renderer;

function init() {

  var width = window.innerWidth;
  var height = window.innerHeight;

  //create threejs redenderer and attach it to dom
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height);
  renderer.setClearColor("grey");
  document.body.appendChild(renderer.domElement);

  //create threejs scene
  scene = new THREE.Scene();

  //create our camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
  camera.position.z = 5;

  //resize threejs canvas if window size is changed.
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onWindowResize, false);

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.bottom = '0px';
  document.body.appendChild( stats.domElement );

  //add stuff to our scene here...
  var geometry = new THREE.CubeGeometry(size,size);
  var material = new THREE.MeshBasicMaterial({
    color:"blue"
  });
  var mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);




  animate();
}

// animation loop
function animate(time) {
  scene.dispatchEvent({type: "animate", message: time});
  camera.dispatchEvent({type:"animate", message: time});
  stats.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
