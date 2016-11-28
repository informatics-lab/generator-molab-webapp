import * as THREE from "three";

export default class {
  static appendToScene(scene, radius = 1) {
    const textureLoader = new THREE.TextureLoader();

    const map = textureLoader.load('/textures/earthSatTexture.jpg', texture => texture);
    const bump = textureLoader.load('/textures/bump.jpg', texture => texture);
    const specular = textureLoader.load('/textures/specular.png', texture => texture);

    const globeGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: map,
      bumpMap: bump,
      bumpScale: 0.015,
      specularMap: specular,
      specular: new THREE.Color('grey'),
      shininess: 10
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);

    scene.add(globeMesh);
  }
}


