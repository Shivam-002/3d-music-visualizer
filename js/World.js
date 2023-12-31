import BoomBox from "./objects/BoomBox";
import * as CANNON from "cannon-es";
import Props from "./objects/props";
import Speaker from "./objects/Speaker";
import Clock from "./objects/Clock";
import Board from "./objects/Board";
import Sign from "./objects/Sign";
import { SONG_DIR } from "./utils/Utils";

export default class World{
    constructor(scene,physics_world,camera,listener){
        this.scene = scene;
        this.physics_world = physics_world;
        this.camera =camera;
        this.listener = listener;
        this.objects = [];
    }

    build_scene(){

        //Boombox
        const boom_box = new BoomBox(new CANNON.Vec3(0,0,-1)).build(this.scene,this.physics_world);

        //Speaker 1
        const speaker_1 = new Speaker(
                                        boom_box,
                                        true,
                                        new CANNON.Vec3(.5,0.1,-2.5),
                                    )
                                    .build(this.scene,this.physics_world);
        this.objects.push(speaker_1);

        //Speaker 2
        const speaker_2 = new Speaker(
                                        boom_box,
                                        false,
                                        new CANNON.Vec3(.5,0.1,2.5),
                                        new CANNON.Quaternion().setFromEuler(0,90,0),
                                    )
                                    .build(this.scene,this.physics_world);

        this.objects.push(speaker_2);

        //Props
        const props = new Props().build(this.scene,this.physics_world);

        //Clock
        const clock = new Clock(boom_box).build(this.scene,this.physics_world);
        this.objects.push(clock);
        
        const sign_1 = new Sign(
                                boom_box,
                                false,
                                SONG_DIR.NEXT,
                                new CANNON.Vec3(3,-.1,-6.25),
                                new CANNON.Quaternion().setFromEuler(0,45,0),
                            )
                            .build(this.scene,this.physics_world);

        const sign_2 = new Sign(
                                boom_box,
                                true,
                                SONG_DIR.PREV,
                                new CANNON.Vec3(3,-.3,6.25),
                                new CANNON.Quaternion().setFromEuler(-0,-45,0),
                            )
                            .build(this.scene,this.physics_world);

    }

    //Frame Update
    update_objects(){
        for (const object of this.objects){
            object.update();
        }
    }
}