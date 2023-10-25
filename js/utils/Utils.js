import * as CANNON from "cannon-es";
const box_pattern = /Cube_\d+/;
const sphere_pattern = /Sphere_\d+/;
const cylinder_pattern = /Cylinder_\d+/;



export default function create_rb(model,rb_config){
    const rb = new CANNON.Body(rb_config);
    model.traverse((mesh) => {
        if (mesh.isMesh) {
            const shape = mesh_to_shape(mesh);

            let position;
            position = new CANNON.Vec3(mesh.position.x,mesh.position.y,mesh.position.z);
            const quaternion = new CANNON.Quaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);
            
            rb.addShape(shape,position,quaternion);
        }
    });

    return rb;
}

function mesh_to_shape(mesh){

    let shape;
    
    //Box
    if(box_pattern.test(mesh.name)){
        shape = new CANNON.Box(mesh.scale);
    }
    
    //Sphere
    else if(sphere_pattern.test(mesh.name)){
        shape = new CANNON.Sphere(mesh.scale.x,6,6);
    }
    
    //Cylinder
    else if(cylinder_pattern.test(mesh.name)){
        shape = new CANNON.Cylinder(mesh.scale.x, mesh.scale.x, mesh.scale.y, 6);
    }

    return shape;
}
export const SONG_DIR = {
    PREV : 0,
    NEXT : 1
}

export function get_glow_shader(){return glow_shader.clone();}