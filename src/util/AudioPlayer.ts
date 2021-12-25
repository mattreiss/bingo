export default class AudioPlayer {
    audioElement: HTMLAudioElement;

    constructor() {
        this.audioElement = document.createElement("AUDIO") as HTMLAudioElement;                              // Append the text to <p>
        document.body.appendChild(this.audioElement);
    }
  
    static self = new AudioPlayer();
    
    static play: (s: string) => void = (audioFile: string) => {
      console.log("play audioFile", audioFile);
      if (AudioPlayer.self.audioElement && audioFile) {
        AudioPlayer.self.audioElement.src = audioFile;
        AudioPlayer.self.audioElement.pause();
        AudioPlayer.self.audioElement.currentTime = 0;
        try {
          AudioPlayer.self.audioElement.play()
        } catch(e) {
          console.log("AudioPlayer error", e)
        }
      }
    }
  }