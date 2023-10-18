import { PositionalAudio} from 'three';
import AudioHandler from './AudioHandler';

export default class AudioSource{
    constructor(model,listener){
        this.model = model;
        this.song = new PositionalAudio(listener);
        this.model.add(this.song);
        this.current_song_index = 0;
        this.loop = false;
        this.song.setRefDistance(20);
        this.is_playing = false;
    }
    next_song(){
        this.current_song_index = ++this.current_song_index % AudioHandler.SONG_COUNT;
        AudioHandler.load_song(
            this.current_song_index,(buffer)=>{
                this.song.setBuffer(buffer);
                this.song.play();
            }
        );
    }
    
    previous_song(){
        if (--current_song_index<0) current_song_index = AudioHandler.SONG_COUNT - 1;
        AudioHandler.load_song(
            this.current_song_index,(buffer)=>{
                this.song.setBuffer(buffer);
                this.song.play();
            }
        );
    }
    play(){
        AudioHandler.load_song(
            this.current_song_index,(buffer)=>{
                this.song.setBuffer(buffer);
                this.song.play();
            }
        );
    }
    stop(){
        this.song.stop();
    }
    switch_play(){
        this.is_playing = !this.is_playing;
        if(this.is_playing) this.play();
        else this.stop();
    }
    seek(percentage){
    
    }
    
    invert_loop(){
        this.loop = !loop;
    }
    
    set_loop(_loop){
        this.loop = _loop;
    }
    
}