import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as CANNON from "cannon-es";
import { QuickHull } from "./QuickHull";

const box_pattern = /Cube_\d+/;
const sphere_pattern = /Sphere_\d+/;
const cylinder_pattern = /Cylinder_\d+/;

export default function create_rb(model,rb_config){
    const rb = new CANNON.Body(rb_config);
    model.traverse((mesh) => {
        if (mesh.isMesh) {
            const shape = test_mesh_to_shape(mesh);

            let position;
            position = new CANNON.Vec3(mesh.position.x,mesh.position.y,mesh.position.z);
            const quaternion = new CANNON.Quaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);
            
            rb.addShape(shape,position,quaternion);
            // console.log("Shape Position ",mesh.name," ",mesh.position);
        }
    });

    return rb;
}

function test_mesh_to_shape(mesh){
    let shape;
    if(box_pattern.test(mesh.name)){
        
        shape = new CANNON.Box(mesh.scale);

    }else if(sphere_pattern.test(mesh.name)){
        shape = new CANNON.Sphere(mesh.scale.x,6,6);
    }else if(cylinder_pattern.test(mesh.name)){
        // console.log("Cylinder x,z : ",mesh.scale);
        shape = new CANNON.Cylinder(mesh.scale.x, mesh.scale.x, mesh.scale.y, 6);
    }else{
        shape = mesh_to_shape(mesh);
    }
    return shape;
}

function get_geometry(mesh){
    let geo;
    if(box_pattern.test(mesh.name)){
        
        geo = new CANNON.BoxBufferGeometry(1,1,1);

    }else if(sphere_pattern.test(mesh.name)){
        geo = new CANNON.SphereBufferGeometry(1,8,8);
    }
    else{
        geo = new CANNON.CylinderBufferGeometry(1,1,1,8,1);
    }
    return geo;
}
function mesh_to_shape(model_mesh){

    const geo = BufferGeometryUtils.mergeVertices(model_mesh.geometry);

    geo.deleteAttribute('normal');  
    geo.deleteAttribute('uv'); 

    const vertices = [];
    const faces = [];

    // geo.computeVertexNormals();

    const positions = geo.attributes.position.array;
    const indexes = geo.index.array;

    for (let i = 0; i < positions.length; i += 3) {
        vertices.push(new CANNON.Vec3(positions[i], positions[i + 1], positions[i + 2]));
    }

    for (let i = 0; i < indexes.length; i += 3) {
        faces.push([indexes[i], indexes[i + 1], indexes[i + 2]]);
    }


    // const shape = new CANNON.ConvexPolyhedron({
    //     vertices : vertices,
    //     faces : faces,
    // });

    const shape = createConvexHullFromPoints(vertices);
    console.log(shape.faceNormals);
    // shape.computeNormals();
    // shape.computeEdges();
    // shape.computeWorldFaceNormals();
    // shape.computeWorldVertices();
    return shape;
}
function createConvexHullFromPoints(vertices) {
    const faces = QuickHull.createHull(vertices);
    return new CANNON.ConvexPolyhedron({
        vertices : vertices,
        faces : faces
    });
}


