import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const base_folder = "assets/models/";
const _model = "_model";
const _collider = "_collider";
const _animation = "_animation";
const format = ".glb";

const models = [
    {
        name : 'player',
        model : false,
        collider : true,
        animation : false,
        interactable: false,
    },
    {
        name : 'boom_box',
        model : true,
        collider : true,
        animation : false,
        interactable: true,

    },
    {
        name : 'props',
        model : true,
        collider : true,
        animation : false,
        interactable: false,

    },
    {
        name : 'speaker',
        model : true,
        collider : true,
        animation : false,
        interactable: true,

    },
    {
        name : 'clock',
        model : true,
        collider : true,
        animation : true,
        interactable: false,

    },
    {
        name : 'board',
        model : true,
        collider : true,
        interactable: false,
    }
]

const loaded_models= {}
const loaded_colliders= {}
const loaded_animations = {}
const loaded_shaders = {}

export default async function load_all_models(){
    for(const model of models){
        let loaded_model;
        let loaded_collider;
        if(model.model){
            loaded_model = await load_model(model.name);
            loaded_models[model.name+_model] = loaded_model.scene;
        }

        if(model.collider){
            loaded_collider = await load_collider(model.name);
            loaded_colliders[model.name+_collider] = loaded_collider.scene;
        }

        if(model.animation){
            loaded_animations[model.name+_animation] = loaded_model.animations; 
        }
    }
    console.log(loaded_models);
    console.log(loaded_colliders);
    console.log(loaded_animations);
}

async function load_model(model_name) {
    return await loader.loadAsync(base_folder+model_name+"/"+model_name+_model+format);
}

async function load_collider(model_name){
    return await loader.loadAsync(base_folder+model_name+"/"+model_name+_collider+format);
}

export function get_model(model_name){
    let loaded_model = loaded_models[model_name+_model];
    // console.log("Name : ",model_name," Model : ",loaded_model);
    return loaded_model;
}

export function get_collider(model_name){
    let loaded_model = loaded_colliders[model_name+_collider];
    console.log("Name : ",model_name," Collider : ",loaded_model);
    return loaded_model;
}

export function get_animations(model_name){
    return loaded_animations[model_name+_animation];
}
