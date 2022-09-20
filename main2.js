import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationClip } from 'three';
import { AnimationMixer } from 'three';

var renderer, scene, camera, cameraGroup, scrollY, sectionMeshes, astronaut, pivot, stars;
const objectsDistance = 4
const sections = 4
const cursor = {}
cursor.x = 0
cursor.y = 0
const clock = new THREE.Clock()
let previousTime = 0
let currentSection = 0


init();

function init() {
  // Renderer.
  renderer = new THREE.WebGL1Renderer({canvas: document.querySelector('#bg'), alpha: true})
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // Create scene.
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020914)

  // Camera
  cameraGroup = new THREE.Group()
  scene.add(cameraGroup)
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 6
  cameraGroup.add(camera)

  //lights
  const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
  directionalLight.position.set(100, 100, 0)
  scene.add(directionalLight)
  scene.add( new THREE.AmbientLight( 0xffffff, 0.5 ) );

  //Object setup
  // addMeshes();
  addParticles();
  addObjects();

  //Event Listeners
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('mousemove', onMouseMove, false );
  window.addEventListener('scroll', onScroll, false );
  scrollY = window.scrollY
}

function addMeshes(){
  const material = new THREE.MeshNormalMaterial({color: 0xeeeeee});
  const material2 = new THREE.PointsMaterial({color: 0xeeeeee, size: 0.005});
  const mesh1 = new THREE.Points(new THREE.TorusGeometry(1, 0.4, 16, 60),material2)
  const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32),material)
  const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),material)
  const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(1),material)

  mesh1.position.y = - objectsDistance * 0
  mesh2.position.y = - objectsDistance * 1
  mesh3.position.y = - objectsDistance * 2
  mesh4.position.y = - objectsDistance * 3

  mesh1.position.x = 2
  mesh2.position.x = 2
  mesh3.position.x = 2
  mesh4.position.x = 2

  mesh1.position.z = -2
  mesh2.position.z = -2
  mesh3.position.z = -2
  mesh4.position.z = -2

  sectionMeshes = [mesh1, mesh2, mesh3, mesh4]
  scene.add(mesh1, mesh2, mesh3, mesh4)
}

function addParticles(){
  const particlesCount = 400
  const positions = new Float32Array(particlesCount * 3)
  for(let i = 0; i < particlesCount; i++)
  {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sections
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }
  const particlesGeometry = new THREE.BufferGeometry()
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particlesMaterial = new THREE.PointsMaterial({color: '#ffeded',sizeAttenuation: true,size: 0.01})
  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  stars = new THREE.Group();
  Array(200).fill().forEach(() =>{
    const geometry = new THREE.IcosahedronGeometry(0.01);
    const materal = new THREE.MeshNormalMaterial({color: 0xadd8e6});
    const star = new THREE.Mesh(geometry, materal);
    const [x,y,z] = [
      ((Math.random() - 0.5) * 10),
      (objectsDistance * 0.5 - Math.random() * objectsDistance * sections),
      ((Math.random() - 0.5) * 10)
    ]
    star.position.set(x,y,z);
    scene.add(star)
    stars.add(star)
    scene.add(stars)
  });
}

function addObjects(){
  pivot = new THREE.Group();
  pivot.position.set(0,0,0)
  const gltfLoader = new GLTFLoader();
  gltfLoader.load('Astronaut.glb', (gltfScene) => {
    astronaut = gltfScene.scene;
    astronaut.traverse(function(node){
      if(node.isMesh){
        node.receiveShadow = true;
        node.castShadow = true;
      }
    });
    astronaut.position.set(0,-1,0);
    pivot.scale.set(0.5,0.5,0.5);
    pivot.add(astronaut)
    scene.add(pivot);
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

function onScroll(){
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / window.innerHeight)
  if(newSection != currentSection)
  {
      currentSection = newSection
  }
}

function onMouseMove( event ) {
  cursor.x = event.clientX / window.innerWidth - 0.5
  cursor.y = event.clientY / window.innerHeight - 0.5
}

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate meshes
    // for(const mesh of sectionMeshes){
    //     mesh.rotation.x += deltaTime * 0.1
    //     mesh.rotation.y += deltaTime * 0.12
    // }
    if (astronaut){
      pivot.rotation.z += deltaTime * -0.5;
      pivot.rotation.x += deltaTime * -0.5;
    }
    stars.traverse(function(star){
      if(star.isMesh == true){
        star.rotation.x += deltaTime * 1;
        star.rotation.y += deltaTime * 0.75;
        star.rotation.z += deltaTime * 0.5;
      }
    })
      
  


    // Animate camera
    camera.position.y = - scrollY / window.innerHeight * objectsDistance
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)    // Call tick again on the next frame
}
tick()