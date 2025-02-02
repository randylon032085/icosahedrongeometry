import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000)
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById("app").appendChild(renderer.domElement)

const light = new THREE.DirectionalLight(0xffffff, 50)
light.position.set(5,10,10)
light.castShadow = true
scene.add(light)

const pointLight = new THREE.PointLight(0xffa500, 0.5, 200)
pointLight.position.set(-10,-10,-10)
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight,1)
scene.add(pointLightHelper)

// const directionalLightHelper  = new THREE.DirectionalLightHelper(light,1)
// scene.add(directionalLightHelper)

// const ambientLight = new THREE.AmbientLight(0xffffff,2)
// scene.add(ambientLight)

const control = new OrbitControls(camera,renderer.domElement)

let p = 0;

// const boxGeometry = new THREE.BoxGeometry()
// const boxMat = new THREE.MeshPhysicalMaterial({color: 0x000fff})
// const box = new THREE.Mesh(boxGeometry, boxMat)
// scene.add(box)


///////////////////////

//DYNAMIC GEOMETRIES

let details = 0;
let colorInterpulation = 0;

let geometry, dodecahedron, wireframe;

function createDynamiGeometry (){
  if(dodecahedron)scene.remove(dodecahedron);
  if(wireframe)scene.remove(wireframe);


  //initializing icosahedron

  geometry = new THREE.IcosahedronGeometry(5,details)

  //adding vertex color

  const colors = []
  const baseColors = new THREE.Color(0x800080)
  
  for(let x = 0; x < geometry.attributes.position.count; x++){
      colors.push(baseColors.r,baseColors.g,baseColors.b)
  }

  geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));

//Creating material with vertex color

const material = new THREE.MeshPhysicalMaterial({
  vertexColors: true,
  roughness: 0.1,
  metalness: 0.7,
  transparent: true,
  transmission: 0.9,
  ior: 1.5,
  reflectivity: 0.9,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  envMap: scene.environment,
  envMapIntensity: 1.5,
  side: THREE.DoubleSide,


})
//Initializing Mesh
dodecahedron = new THREE.Mesh(geometry,material)
 scene.add(dodecahedron) 
// p+=Math.random();
dodecahedron.position.set(p,p,p);
//adding wireframe
const edgeGeometry = new THREE.EdgesGeometry(geometry)
const edgeMat = new THREE.LineBasicMaterial({color: 0xffffff})
wireframe = new THREE.LineSegments(edgeGeometry, edgeMat)
scene.add(wireframe)
wireframe.position.set(p,p,p);

}

createDynamiGeometry()
//////////////////////

//Defining colors interpolation

const startColor = new THREE.Color(0x800080)
const targetColor = new THREE.Color(0x00008b)

//Listening for orbitcontrols change

control.addEventListener("change",function(){
  colorInterpulation = 0
});

function animate(){
  
  if(colorInterpulation < 1){
      colorInterpulation += 0.02;
      //creating array for interpolated colors
      const interPolatedColors = [];
      const color = new THREE.Color();

      //iterpolating colors
      for(let x = 0; x < geometry.attributes.position.count; x++ ){
          color.lerpColors(startColor,targetColor,colorInterpulation)
          interPolatedColors.push(color.r,color.g,color.b)
      }
      geometry.setAttribute("color",new THREE.Float32BufferAttribute(interPolatedColors,3));


  }
  control.update()
  dodecahedron.rotation.y += 0.001
  dodecahedron.rotation.x += 0.005
  
  wireframe.rotation.copy(dodecahedron.rotation)

  renderer.render(scene,camera)
  requestAnimationFrame(animate)
  console.log("x="+dodecahedron.position.x);
  console.log("y="+dodecahedron.position.y);

  console.log("z="+dodecahedron.position.z);

}

animate()


document.addEventListener("keydown",function(event){

  if(event.key === "ArrowUp"){
      details = Math.min(details+1,5)
      createDynamiGeometry()
  }else if(event.key === "ArrowDown"){
      details = Math.max(details-1,0)
      createDynamiGeometry()
  }


})