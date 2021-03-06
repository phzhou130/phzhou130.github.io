// alert('Welcome to the user test! This is a webpage that could create a 3d scene based on your emotions. Some part of its functionalities are still needed to be done. Task 1: Interact with the main page. Task 2: Input your message. Task 3: Interact with the 3D scene');
Parse.initialize("zkAC9LL85g3L7768x1uleGwfWTh4uFuIJ4WTjlLJ","ZCWkna6bZ1BgWfIfo94FciaZD8McZUJQ7WR6C6nm"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = 'https://parseapi.back4app.com/'

const hero = document.querySelector('[data-hero]')
const menu = document.querySelector('[data-menu]')
const form = document.querySelector('#reply');
const enterbutton = document.querySelector('.wrapper');
const closeform = document.querySelector('.close');
const submitform = document.querySelector('.sendout');
const threed = document.getElementById('threed');
const inputs = document.querySelectorAll("#reply input:not([type=submit])");
const finish = document.getElementById("quit");
const finaldisplay = document.getElementById("finaldisplay");
const account =document.getElementById("account");


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
    cursor1.style.zIndex="0";
});

closeform.addEventListener('click', function() {
    form.className = 'disappear';
})








form.addEventListener('submit', function(e) {
  e.preventDefault();
  threed.className = 'show';
  form.className = 'disappear';
  addFriend();

})

async function addFriend(){
  const newFriend ={};
  for (let i = 0; i<inputs.length; i++){
    let key = inputs[i].getAttribute('name');
    let value = inputs[i].value;
    newFriend[key] = value;
  }
  if(newFriend.responses !=""){
   const newFriendData = new Parse.Object('final');
   newFriendData.set('responses',newFriend.responses);  
   
   try{
      const results = await newFriendData.save();
      resetFormFields();
      displayFriends();
   }catch(error){
     console.error('error');
   }
  }

}

function resetFormFields(){
  document.getElementById("responses").value="";
}

const theListItem = document.getElementById("Listresult");


async function displayFriends() {
  const friends = Parse.Object.extend('final');
  const query = new Parse.Query(friends);
  const results = await query.ascending('createdAt').find();

  // console.log(results);
  try {
      results.forEach(function(eachFriend) {
          const responses = eachFriend.get('responses');
          console.log(responses);
          theListItem.innerHTML = `<p>You are feeling ${responses} now, explore the 3d world with your mouse. You can press to rotate the images. Hope you have a nice day<p>`;
          theListItem.style.animation="fadeIn 8s 1";
          theListItem.style.animationFillMode = "forwards";
          const newemotion=document.getElementById("listwords");
          newemotion.innerHTML+=`${responses}`;
          newemotion.innerHTML+=" ";
        })
  } catch(error) {
      console.log("error: ", error);
  }
}





let scene, camera, renderer, skyboxGeo, skybox, controls;
let skyboxImage = "scene1";


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

const good = document.getElementById('good');
const bad = document.getElementById('bad');
const medium = document.getElementById('medium');

function switchSkyBox (skyboxName) {
  scene.remove(skybox);
  skyboxImage = skyboxName;
  const materialArray = createMaterialArray(skyboxImage);

  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

good.addEventListener('click', () => switchSkyBox('scene1'))
medium.addEventListener('click', () => switchSkyBox('scene2'))
bad.addEventListener('click', () => switchSkyBox('scene3'))


finish.addEventListener('click', function() {
  threed.className = "hide";
  enterbutton.className ="hide";
  finaldisplay.classList="show";
});