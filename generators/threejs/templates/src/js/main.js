/* eslint-env browser */
'use strict';

import * as THREE from 'three';
import Controls from 'three-orbit-controls';
import DatGui from 'dat-gui';
import Stats from 'stats-js';
import Globe from './globe';

const OrbitControls = Controls(THREE);

let renderer, scene, camera, ambientLight, directionalLight, controls;

/**
 * Initialises everything
 */
function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // create threejs redenderer and attach it to dom
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height);
  renderer.setClearColor('black');
  document.body.appendChild(renderer.domElement);

  // create threejs scene
  scene = new THREE.Scene();

  // create our camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
  camera.position.z = 5;

  // add some lighting to our scene
  ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(0xbbbbbb, 0.8);
  scene.add(directionalLight);
  directionalLight.position.copy(camera.position);

  // add some controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 3;
  controls.enableDamping = true;
  controls.dampingFactor = 0.15;
  controls.rotateSpeed = 0.3;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  // sync camera and directional light so we can see what we're doing!!
  controls.addEventListener('change', () => directionalLight.position.copy(camera.position));

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
  Globe.appendToScene(scene, 1);


  initStats();
  initGuiControls();
  // start animation loop
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

/**
 * Initialises the Dat-Gui controls - press 'h' in app to show/hide them.
 * see https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
 */
function initGuiControls() {
  //add advanced controls - press 'h' in gui to show/hide
  const gui = new DatGui.GUI();
  // DatGui.GUI.toggleHide();   //uncomment to hide controls by default

  const guiControlsFolder = gui.addFolder('controls');
  guiControlsFolder.add(controls, 'rotateSpeed',0,1).listen();
  guiControlsFolder.add(controls, 'autoRotate').listen();
  guiControlsFolder.add(controls, 'autoRotateSpeed',0,1).listen();
  guiControlsFolder.add(controls, 'enableDamping').listen();
  guiControlsFolder.add(controls, 'dampingFactor',0,1).listen()

  const guiCamFolder = gui.addFolder('camera');
  guiCamFolder.add(camera.position, 'x', -5, 5).listen();
  guiCamFolder.add(camera.position, 'y', -5, 5).listen();
  guiCamFolder.add(camera.position, 'z', -5, 5).listen();

  scene.addEventListener('animate', () => controls.update());
}

/**
 * Initialises JS performance monitoring
 */
function initStats() {
  const stats = new Stats();

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.bottom = '0px';

  document.body.appendChild( stats.domElement );

  scene.addEventListener('animate', () => stats.update());
}

init();
