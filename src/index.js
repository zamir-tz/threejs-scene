import './styles/main.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {DragControls} from 'three/examples/jsm/controls/DragControls'
import addShape from './scripts/addShape';
import loadFile from './scripts/loadDae';


let scene, camera, renderer, camControls, raycaster, selected, mouse, dragControls;
let interactableObj = [];
let file = document.querySelector('#fileImport');

function init () {
    
    // Create scene with white background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Create grid
    let grid = new THREE.GridHelper(10, 10);
    scene.add(grid);

    // Add light
    let light = new THREE.PointLight(0xffffff);
    light.position.set(10,10,10);
    scene.add(light);

    // Init raycaster
    raycaster = new THREE.Raycaster();

    // Init camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Init mouse capture
    mouse = new THREE.Vector2();
    
    // Init renderer and add it to the DOM  
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('dropZone').appendChild(renderer.domElement);
    
    // Init controlls
    camControls = new OrbitControls(camera, renderer.domElement);
    dragControls = new DragControls(interactableObj, camera, renderer.domElement); 

    // drag event listeners
    dragControls.addEventListener('dragstart', dragStartCallback, false);
    dragControls.addEventListener('dragend', dragEndCallback, false);

}

function render () {

    camera.updateMatrixWorld();
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(interactableObj, true);

    if (intersects.length > 0) {

        if (selected != intersects[0].object) {
            if (selected) {
                selected.material.color.setHex(selected.currentHex);
            }

            selected = intersects[0].object;
            selected.currentHex = selected.material.color.getHex();
            selected.material.color.setHex(0xff0000);

        }

    } else {
        if (selected) {
            selected.material.color.setHex(selected.currentHex);
        }
        selected = null;
    }

    renderer.render(scene, camera);

}

// event listeners
window.addEventListener('keyup', deleteShape);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('resize', onWindowResize, false);

/**
 * Delete selected obj
 * @param {*} event 
 */
function deleteShape(event) {

    
    // console.log(scene);
    
    if (event.code === "Delete" && selected) {
        console.log(selected);
        selected.geometry.dispose();
        selected.material.dispose();
        if(selected.parent){
            selected.parent.remove(selected);
        }
        else {
            scene.remove(selected);
        }
        animate();
    }

}

// fit to size of the window
function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// get mouse coordinates
function onMouseMove (event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// disable camera controlls when draging
function dragStartCallback (event) {
    camControls.enabled = false;
    console.log(event);
}

// re-enable drag controls afrer drag end
function dragEndCallback (event) {
    camControls.enabled = true;
}

// animation loop
function animate () {
    requestAnimationFrame(animate); 
    render();
}

// adding shape to the scene
document.getElementById('add').addEventListener('click', ()=> {
    let shapeType = document.getElementById('shapes').value;
    let shape = addShape(shapeType);
    scene.add(shape);
    interactableObj.push(shape);
}, false);

// load file
file.addEventListener('change', function() {
    
    handleFileUpload(file.files[0]);

    file.value = null;

});

// drop file into scene
function dropInScene() {
    let holder = document.getElementById('dropZone');

    holder.ondragover = function() {
        this.className = 'hover';
        return false;
    }

    holder.ondragend = function() {
        this.className = '';
        return false;
    }

    holder.ondrop = function(e) {

        this.className = '';
        e.preventDefault();

        let file = e.dataTransfer.files[0];
        console.log(file);

        handleFileUpload(file);
    }
}


let handleFileUpload = async (file) => {
    try{
        let res = await loadFile(file);
        console.log(res);
        scene.add(res);
        interactableObj.push(res);
    } catch (e) {
        console.log(e);
    }
}

dropInScene();

init();
animate();