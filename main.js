import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

var camera, scene, renderer, mesh, material, controls, t;
const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );
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

  controls = new OrbitControls(camera, renderer.domElement);

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
  t = document.body.getBoundingClientRect().top;
}

function animate() {
  target.x = ( 1 - mouse.x ) * 0.002;
  target.y = ( 1 - mouse.y ) * 0.002;
  // camera.position.x += 0.05 * ( target.x - camera.position.x );
  camera.position.y += 0.05 * ( target.y - camera.position.y );
  camera.position.x = (t * -0.01)
  camera.position.x += 0.5 * ( target.x - camera.position.x );

  requestAnimationFrame(animate);
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove( event ) {
  // console.log(mouse)
  // console.log(event)
  // console.log(windowHalf)
  // console.log(target)
  mouse.x = ( event.clientX - windowHalf.x );
  mouse.y = ( event.clientY - windowHalf.x );

  // target.x = ( 1 - mouse.x ) * 0.002;
  // target.y = ( 1 - mouse.y ) * 0.002;
  // camera.position.x += 0.05 * ( target.x - camera.position.x );
  // camera.position.y += 0.05 * ( target.y - camera.position.y );
}

function scrollCamera(){
  t = document.body.getBoundingClientRect().top;
  
  //camera.position.x = t * -0.01;
  //camera.position.z = t * -0.01 + 30;
  //camera.position.x = t * -0.0002;
  // camera.position.y = t * -0.0002;
}

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const materal = new THREE.MeshStandardMaterial({color: 0xfff000});
  const star = new THREE.Mesh(geometry, materal);
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star)
}
