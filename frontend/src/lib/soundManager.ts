// frontend/src/soundManager.ts
class SoundManager {
  // store sounds as HTML Audio
  private sounds: Record<string, HTMLAudioElement> = {};
  private initialized = false;

  // initialize sound files
  private initSounds() {
    // ensure this is run inside the browser
    if (this.initialized || typeof window === 'undefined') return;
    //initializing each soundfile as a new name
    this.sounds = {
      explosion: new Audio("/sounds/explosion.mp3"),
      flag: new Audio("/sounds/flag.mp3"),
      gameStart: new Audio("/sounds/game_start.mp3"),
      victory: new Audio("/sounds/victory.mp3"),
    };

    this.initialized = true;
  }

  // play given sound
  play(name: string) {
    // ensure sounds are initialized
    this.initSounds();

    // if the sound exists, play it
    if (this.sounds[name]) {
      this.sounds[name].currentTime = 0; // restart if already playing
      this.sounds[name].play().catch(error => {
        console.warn('Failed to play sound:', error);                    // Show error if sound cannot be tracked
      });
    }
  }
}

// export for use in tsx components
const soundManager = new SoundManager();
export default soundManager;
