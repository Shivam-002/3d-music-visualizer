import { get_model } from "../utils/modelloader";

export default class Ocean {
    constructor(){
        this.model_name = "ocean";
        this.model = get_model(this.model_name);
    }

    build(scene){
        scene.add(this.model);
        return this;
    }
}