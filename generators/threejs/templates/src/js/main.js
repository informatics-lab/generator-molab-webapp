/* eslint-env browser */
'use strict';

import THREE from "three";

let scene;
let camera;
let renderer;

/**
 * Initialises everything
 */
function init() {
  let width = window.innerWidth;
  let height = window.innerHeight;

  // create threejs redenderer and attach it to dom
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height);
  renderer.setClearColor('grey');
  document.body.appendChild(renderer.domElement);

  // create threejs scene
  scene = new THREE.Scene();

  // create our camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
  camera.position.z = 5;

  /**
   * Updates threejs camera & renderer in accordance with changes to
   * the browser window
   */
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', onWindowResize, false);

  // add stuff to our scene ...
  let geometry = new THREE.CubeGeometry(size, size);
  let material = new THREE.MeshBasicMaterial({color: 'blue'});
  let mesh = new THREE.Mesh(geometry, material);

  self.scene.add(mesh);

  animate(0);
}

/**
 * Animation loop
 * @param {number} time time since function was last called
 */
function animate(time) {
  scene.dispatchEvent({type: 'animate', message: time});
  camera.dispatchEvent({type: 'animate', message: time});
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
