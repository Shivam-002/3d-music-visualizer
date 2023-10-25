const base_folder = "./assets/songs/";
const songs = [
    "fade.mp3",
] 

function get_songs(){
    return songs.map((song)=> get_song_full_path(song));
}
function get_song_full_path(song){
    return base_folder + "/" + song;
}
const AudioHandler = {
    get_songs,
};

export default AudioHandler;