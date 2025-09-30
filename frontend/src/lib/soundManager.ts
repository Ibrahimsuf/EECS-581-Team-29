// frontend/src/SoundManager.js
class SoundManager {
  sounds: any;
  constructor() {
    this.sounds = {
      explosion: new Audio("/sounds/explosion.mp3"),    //initializing the sounds with names
      flag: new Audio("/sounds/flag.mp3"),
      gameStart: new Audio("/sounds/game_start.mp3"),
      victory: new Audio("/sounds/victory.mp3"),
    };
  }

  play(name: keyof typeof this.sounds) {
    if (this.sounds[name]) {
      this.sounds[name].currentTime = 0; // restart if already playing
      this.sounds[name].play();
    }
  }
}

const soundManager = new SoundManager();
export default soundManager;
