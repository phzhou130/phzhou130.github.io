alert('Welcome to the user test! This is a webpage that could create a 3d scene based on your emotions. Some part of its functionalities are still needed to be done. Task 1: Interact with the main page. Task 2: Input your message. Task 3: Interact with the 3D scene');

const hero = document.querySelector('[data-hero]')

const menu = document.querySelector('[data-menu]')

const form = document.querySelector('#reply');

const enterbutton = document.querySelector('.wrapper');

const closeform = document.querySelector('.close');

const submitform = document.querySelector('.sendout');

const threed = document.getElementById('threed');



window.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e
  const x = Math.round((clientX / window.innerWidth) * 100)
  const y = Math.round((clientY / window.innerHeight) * 100)
  let cursor1=document.getElementById('cursor1');
	gsap.to(hero, {
    '--x': `${x}%`,
    '--y': `${y}%`,
    duration: 0.3,
    ease: 'sine.out',
  })
  cursor1.style.left=e.x +"px";
  cursor1.style.top=e.y +"px";
});

enterbutton.addEventListener('click', function() {
    form.className = 'show';
});

closeform.addEventListener('click', function() {
    form.className = 'hide';
})

// submitform.addEventListener('click', function(){
//   // form.className = 'hide';
//   console.log('hi');
//   enterbutton.className ='hide';
//   console.log('bye');
//   threed.className = 'show';

// })
form.addEventListener('submit', function(e) {
  e.preventDefault();
  threed.className = 'show';
  form.className = 'disappear';
})

let scene, camera, renderer, skyboxGeo, skybox, controls;
const skyboxImage = "scene1";


function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    45,
    30000
  );
  camera.position.set(1200, -250, 20000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.id = "canvas";

  const threed=document.getElementById('threed');
  threed.appendChild(renderer.domElement);
  const materialArray = createMaterialArray(skyboxImage);
  skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
 
  scene.add(skybox);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enabled = true;
  controls.minDistance = 700;
  controls.maxDistance = 1500;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;
  window.addEventListener('resize', onWindowResize, false);

  animate();
  camera.position.set(1200, -250, 2000);

}


function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

  init();



function createPathStrings(filename) {
  const basePath = "./image/";
  const baseFilename = basePath + filename;
  const fileType = ".png";
  const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
  const pathStings = sides.map(side => {
    return baseFilename + "_" + side + fileType;
  });
  return pathStings;
}



function createMaterialArray(filename) {
  const skyboxImagepaths = createPathStrings(filename);
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); // <---

  });
  return materialArray;
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}