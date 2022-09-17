import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

var camera, scene, renderer, mesh, material, controls, scrollY;
const mouse = new THREE.Vector2();


init();
animate();

function init() {
  // Renderer.
  renderer = new THREE.WebGL1Renderer({canvas: document.querySelector('#bg'),})
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create camera.
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 30;
  camera.position.y = 1;

  // Create scene.
  scene = new THREE.Scene();

  //controls = new OrbitControls(camera, renderer.domElement);

  //torus
  var geometry = new THREE.TorusGeometry(10,3,16,100);
  material = new THREE.MeshStandardMaterial({color: 0xFF6347});
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  var geometry = new THREE.BoxGeometry();
  mesh = new THREE.Mesh(geometry, material)
  mesh.position.z = 25;
  scene.add(mesh)

  // Create ambient light and add to scene.
  var light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  // Create directional light and add to scene.
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  //lighting
  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(5,5,5);
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight, ambientLight);

  const lightHelper = new THREE.PointLightHelper(pointLight);
  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(lightHelper, gridHelper);

  //space background
  const spaceTexture = new THREE.TextureLoader().load('images/space.jpg');
  scene.background = spaceTexture;

  Array(200).fill().forEach(addStar);

  //Event Listeners
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener( 'mousemove', onMouseMove, false );
  document.body.onscroll = scrollCamera;
  scrollY = window.scrollY;
}



function animate() {
  animateCamera();

  requestAnimationFrame(animate);
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function animateCamera() {
  camera.position.y = - scrollY / window.innerHeight * 4
  console.log(- scrollY )
  console.log(window.innerHeight)
  const parallaxX = ((mouse.x) - camera.position.x)
  const parallaxY = - ((mouse.y) - camera.position.y)
  camera.position.x += parallaxX
  camera.position.y += parallaxY
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove( event ) {
  mouse.x = event.clientX / window.innerWidth - 0.5
  mouse.y = event.clientY / window.innerHeight - 0.5
}

function scrollCamera(){
  scrollY = window.scrollY
}

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const materal = new THREE.MeshStandardMaterial({color: 0xfff000});
  const star = new THREE.Mesh(geometry, materal);
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star)
}
