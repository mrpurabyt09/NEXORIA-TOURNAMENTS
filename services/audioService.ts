
export const SOUNDS = {
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  JOIN: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  ADMIN_TAB: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
  APPROVE: 'https://assets.mixkit.co/active_storage/sfx/2014/2014-preview.mp3',
  REJECT: 'https://assets.mixkit.co/active_storage/sfx/2021/2021-preview.mp3',
  SCAN: 'https://assets.mixkit.co/active_storage/sfx/2559/2559-preview.mp3',
  NOTIF: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  HOVER: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
};

class AudioService {
  private static instance: AudioService;
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public play(soundUrl: string, volume: number = 0.4) {
    let audio = this.audioCache.get(soundUrl);
    if (!audio) {
      audio = new Audio(soundUrl);
      this.audioCache.set(soundUrl, audio);
    }
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(e => console.debug('Audio playback blocked by browser policy until interaction.'));
  }
}

export const audioService = AudioService.getInstance();
