import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

var camera, scene, renderer, mesh, material, controls, scrollY;
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
  renderer.shadowMap.enabled = true;


  // Create camera.
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 30;
  camera.position.y = 5;

  // Create scene.
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00000)

  controls = new OrbitControls(camera, renderer.domElement);

  //torus
  var geometry = new THREE.TorusGeometry(10,3,16,100);
  material = new THREE.MeshStandardMaterial({color: 0xFF6347});
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  //cube
  var geometry = new THREE.BoxGeometry();
  mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  mesh.position.z = -10;
  scene.add(mesh)

  //light
  var sunlight = new THREE.PointLight( 0xffff00, 1, 0, 0);  
  sunlight.position.set(25,25,25)
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.width = 2048;
  sunlight.shadow.mapSize.height = 2048;
  // sunlight.shadow.radius = 10;
  scene.add(sunlight);
  scene.add( new THREE.AmbientLight( 0xffffff, 0.1 ) );

  //helper
  const lightHelper = new THREE.PointLightHelper(sunlight);
  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(lightHelper, gridHelper);

  //loader
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('assets/donny/scene.gltf', (gltfScene) => {
    const model = gltfScene.scene;
    model.traverse(function(node){
      if(node.isMesh){
        // node.receiveShadow = true;
        node.castShadow = true;
      }
    });
    model.position.set(0,0,-2);
    model.scale.set(0.05,0.05,0.05);
    scene.add(model);
  });


  Array(200).fill().forEach(addStar);

  //Event Listeners
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener( 'mousemove', onMouseMove, false );
  document.body.onscroll = scrollCamera;
  scrollY = window.scrollY

  addPlane();
}

function animate() {
  animateCamera();
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function animateCamera() {
  target.x = (  - mouse.x ) * 0.002;
  target.y = (  - mouse.y ) * 0.002;
  camera.position.y += 0.05 * ( target.y - camera.position.y ) + 0.1;
  camera.position.x = (scrollY * 0.01)
  camera.position.x += 0.5 * ( target.x - camera.position.x );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove( event ) {
  mouse.x = ( event.clientX - windowHalf.x );
  mouse.y = ( event.clientY - windowHalf.x );
}

function scrollCamera(){
  scrollY = window.scrollY
}

function addPlane(){
  const planeSize = 400;
  const loader = new THREE.TextureLoader();
  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  const repeats = planeSize/2;
  texture.repeat.set(repeats,repeats);
  const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.receiveShadow = true;
  mesh.rotation.x = Math.PI * -0.5;
  // mesh.position.y = -0.5;
  scene.add(mesh);

  // //plane
  // geometry = new THREE.PlaneGeometry( 2000, 2000, 8 ,8);
  // material = new THREE.MeshPhongMaterial( {color: 0x999999, side: THREE.DoubleSide} );
  // const plane = new THREE.Mesh( geometry, material );
  // plane.receiveShadow = true;
  // scene.add( plane );
  // plane.rotation.x = 90 * Math.PI/180;
}

function addStar(){
  const geometry = new THREE.TorusKnotGeometry(0.25, 0.1);
  const materal = new THREE.MeshStandardMaterial({color: 0xfff000});
  const star = new THREE.Mesh(geometry, materal);
  star.castShadow = true;
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star)
}
