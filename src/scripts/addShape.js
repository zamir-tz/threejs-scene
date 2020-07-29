import * as THREE from 'three';
import Generators from './utils/Genretators'

function addShape (shapeType) {

    return createShape(shapeType);

}

function createShape (shapeType) {
    let geometry;
    switch (shapeType) {
        case "piramid":
            geometry = new THREE.TetrahedronGeometry(1);
            break;
        case "cube":
            geometry = new THREE.BoxGeometry(1,1,1);
            break;
        case "sphere":
            geometry = new THREE.SphereGeometry(1);
            break;
        default:
            break;
    }

    const material = new THREE.MeshBasicMaterial( {color: Generators.colorGenerator()} );
    let shape = new THREE.Mesh(geometry, material);
    shape.position.set(...Generators.positionGenerator(-4,4));
    shape.rotation.set(Generators.randomValGenerator(Math.PI), Generators.randomValGenerator(Math.PI), 0);

    return shape;
}

export default addShape;