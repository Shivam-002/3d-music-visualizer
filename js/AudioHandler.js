import {AudioLoader} from 'three';


const base_folder = "./assets/songs/";
const format = ".mp3";
const song_names = [
    "fade",
] 

const COUNT = song_names.length;

const audio_loader = new AudioLoader();

function load_song(song_index,on_load){
    audio_loader.load(base_folder+song_names[song_index]+format, function (buffer) {
        on_load(buffer);
    });  
}

const AudioHandler = {
    load_song,
    COUNT
};

export default AudioHandler;