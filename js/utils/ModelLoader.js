import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const base_folder = "assets/models/";
const _model = "_model";
const _collider = "_collider";
const format = ".glb";

const models = [
    {
        name : 'ocean',
        model : true,
        collider : false,
    },
    {
        name : 'beach',
        model : true,
        collider : true,
    },
    {
        name : 'small_tower',
        model : true,
        collider : true,
    },
    // {
    //     name : 'watch_tower',
    //     model : true,
    //     collider : true,
    // },
    {
        name : 'player',
        model : false,
        collider : true,
    },
    {
        name : 'boombox',
        model : true,
        collider : false,
    }
]
// const models = [
//     {
//         name : 'ocean',
//         model : true,
//         collider : false,
//     },
//     {
//         name : 'beach',
//         model : true,
//         collider : true,
//     },
//     {
//         name : 'small_tower',
//         model : true,
//         collider : true,
//     },
//     {
//         name : 'watch_tower',
//         model : true,
//         collider : true,
//     },
//     {
//         name : 'player',
//         model : false,
//         collider : true,
//     }
// ]
const loaded_models= {}
const loaded_colliders= {}

export default async function load_all_models(){
    for(const model of models){
        if(model.model){
            const loaded_model = await load_model(model.name);
            loaded_models[model.name+_model] = loaded_model.scene;
        }

        if(model.collider){
            const loaded_collider = await load_collider(model.name);
            loaded_colliders[model.name+_collider] = loaded_collider.scene;
        }
    }
    console.log(loaded_models);
}

async function load_model(model_name) {
    return await loader.loadAsync(base_folder+model_name+"/"+model_name+_model+format);
}

async function load_collider(model_name){
    return await loader.loadAsync(base_folder+model_name+"/"+model_name+_collider+format);
}

export function get_model(model_name){
    return loaded_models[model_name+_model];
}

export function get_collider(model_name){
    return loaded_colliders[model_name+_collider];
}
