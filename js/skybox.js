import * as THREE from 'three';

function get_skybox_files(folder_name) {
    const base_folder = "skyboxes/"+folder_name+"/";
    const file_type = ".jpg";
    const sides = [
        "ft",
        "bk",
        "up",
        "dn",
        "rt",
        "lf"
    ];
    const skybox_files = sides.map(side => {
        return base_folder + folder_name+ "_" + side + file_type;
    });
    
    return skybox_files;
}
function get_texture_array(folder_name) {
    const skybox_files = get_skybox_files(folder_name);
    const texture_array = skybox_files.map(file => {
        let texture = new THREE.TextureLoader().load(file);
        return texture;
    });
    return texture_array;
}

function get_skybox_mesh(folder_name) {

  const texture_array = get_texture_array(folder_name);
  const skybox_geometry = new THREE.BoxGeometry(10000, 10000, 10000);
  return new THREE.Mesh(skybox_geometry, texture_array);
}

export { get_skybox_mesh };