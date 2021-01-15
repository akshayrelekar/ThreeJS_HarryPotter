var audio;
window.onload = function() {
    audio = new Audio('./hedwigs_theme.mp3');
    // document.getElementById("title_audio").play();
}

let container;
let camera;
let portalCamera;
let renderer;
let scene;
let m1;
let m2;
let p1;
let p2;
var clock = new THREE.Clock();
var delta = clock.getDelta();
// var model;
var mixer;


function loadModel (url) {
    return new Promise(resolve => {
        new THREE.GLTFLoader().load(url, resolve);
    });
}


function init() {
    container = document.querySelector(".scene");
  
    //Create scene
    scene = new THREE.Scene();
  
    const fov = 35;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 500;
  
    //Camera setup
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-6, 2, 32);
    // camera.position.set(-2, 14, 22);
  
    const ambient = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambient);
  
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(50, 50, 100);
    scene.add(light);

    //Renderer
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  
    container.appendChild(renderer.domElement);

    let controls = new THREE.OrbitControls( camera, renderer.domElement);
    // controls.enableRotate = false;

    // lock the horizontal rotation
    controls.minPolarAngle = Math.PI/2;
    controls.maxPolarAngle = Math.PI/2;
    
    // limiting horizontal rotate
    controls.minAzimuthAngle = -Math.PI * 0.1;
    controls.maxAzimuthAngle = Math.PI * 0.2; 

    //limit the zoom in and zoom out
    controls.maxDistance = 32; // zoom out
    controls.minDistance = 10; // zoom in
    controls.update();
    
    //Load Model
    // let loader = new THREE.GLTFLoader();
    // loader.load("./3D-Models/portal/scene.gltf", function(gltf) {
    //     model = gltf.scene;
    //     gltf.scene.position.set(-9,-4,0);
    //     gltf.scene.scale.set(0.1,0.1,0.1);
        
        
    //     mixer = new THREE.AnimationMixer(gltf.scene);
        
    //     var action = mixer.clipAction( gltf.animations[0]);
    //     action.play();
        
    //     scene.add(model);
    //     hall = gltf.scene.children[0];
    //   animate();
    // });

    p1 = loadModel('./3D-Models/great_hall/scene.gltf').then(result => {  m1 = result.scene.children[0]; });
    p2 = loadModel('./3D-Models/portal/scene.gltf').then(result => {  m2 = result; });

    Promise.all([p1,p2]).then(() => {

        console.log("Resolved");
        m1.position.set(6,-2,0);
        m2.scene.position.set(-10,-1,-10);
        m2.scene.scale.set(0.1,0.1,0.1);
        mixer = new THREE.AnimationMixer(m2.scene);
        var action = mixer.clipAction(m2.animations[0]);
        action.play();

        //add model to the scene
        scene.add(m1);
        scene.add(m2.scene);

        //render loop
        animate();  
        audio.play();  
        document.getElementById('heading').style.animation = "slideInFromBottom 3s ease-in";
    });
}




function animate() {
    requestAnimationFrame(animate);
    // portal.rotation.z += 0.005;
    // controls.update();
    if ( m2 ) mixer.update( clock.getDelta() );
    renderer.render(scene, camera);
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);
