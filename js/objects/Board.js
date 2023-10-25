import * as CANNON from "cannon-es";
import * as THREE from 'three';

import create_rb from "../utils/Utils";
import { get_collider, get_model } from "../utils/modelloader";



export default class Board {
    constructor(position=CANNON.Vec3.ZERO,quaternion=CANNON.Quaternion.ZERO){
        this.model_name = "board";
        this.model = get_model(this.model_name);
        this.model.position.set(position.x,position.y,position.z);
        const collider = get_collider(this.model_name);
        this.rb = create_rb(
            collider,
            {
                mass : 500,
                position: position,
                quaternion : quaternion,
                type : CANNON.Body.KINEMATIC
            }
        );      
        // var playlist_canvas = document.createElement("canvas");

        const width = 1;
        const height = 2;

        // playlist_canvas.width = width;
        // playlist_canvas.height = height;

        // var ctx = playlist_canvas.getContext("2d");
        // const text_texture = new THREE.TextTexture({
        //     text: 'Your Text Here',
        //     fontFamily: 'Arial',
        //     fontSize: 36,
        //     fillStyle: '#000000', // Text color
        //     backgroundColor: '#ffffff', // Background color
        //   }); 
        // var material = new THREE.MeshBasicMaterial( { map: text_texture } );

        // ctx.fillStyle = "red";
        // ctx.fillRect(0, 0, width, height);
        // ctx.fillStyle = "black";
        // ctx.font = "5px sans-serif";
        // ctx.fillText("1", 1, 1);
        // texture.needsUpdate = true;

        // texture.minFilter = THREE.NearestFilter;
        // texture.magFilter = THREE.NearestFilter;

        // const text_plane = new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);
        // text_plane.rotateY(Math.PI / 2);
        // text_plane.position.set(4,2,0);
        // this.text_plane = text_plane;

    }
    build(scene,physics_world){
        scene.add(this.model);
        physics_world.addBody(this.rb);
        // scene.add(this.text_plane);
        return this;
    }
    update(){

    }
}