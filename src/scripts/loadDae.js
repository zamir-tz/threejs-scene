import {ColladaLoader} from 'three/examples/jsm/loaders/ColladaLoader'

let loadFile = (file) => {
    
    return new Promise((resolve, reject) => {
        if(!new RegExp('.dae$').test(file.name)){
            file.value = null;
            return reject(Error("wrong file type"));
        }
    
        let fileUrl = URL.createObjectURL(file);
    
        let loader = new ColladaLoader();
    
        loader.load(fileUrl, (collada) => {
            
            resolve(collada.scene);        
    
        });
    })
}

export default loadFile;