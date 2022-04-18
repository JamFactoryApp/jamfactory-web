import {Injectable} from '@angular/core';
import {ViewStore} from "../stores/view.store";

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {

  public audio: HTMLAudioElement;
  public fadeAudio: number;
  private accessVar = 0;

  constructor(public viewStore: ViewStore) {
    this.audio = new Audio();
    this.viewStore.$view.subscribe(value => {
      if (!value.searchBarViewToggle && !value.searchResultViewToggle) {
        this.stopAudio();
      }
    })
  }

  playAudio(source: string): void {
    if (!this.audio.paused) {
      clearInterval(this.fadeAudio);
      this.fadeOut();
      setTimeout(() => {
        this.audio.src = source;
        this.audio.volume = 1;
        this.audio.load();
        this.audio.play();

        this.fadeAudio = setInterval(() => {
          const fadePoint = this.audio.duration - 2;
          if ((this.audio.currentTime >= fadePoint) && (this.audio.volume !== 0)) {
            this.audio.volume -= 0.1
          }

          if (this.audio.volume < 0.003) {
            clearInterval(this.fadeAudio);
          }
        }, 200);
      }, 1500);
    } else {
      this.audio.src = source;
      this.audio.volume = 1;
      this.audio.load();
      this.audio.play();

      this.fadeAudio = setInterval(() => {
        const fadePoint = this.audio.duration - 2;
        if ((this.audio.currentTime >= fadePoint) && (this.audio.volume !== 0)) {
          this.audio.volume -= 0.1
        }

        if (this.audio.volume < 0.003) {
          clearInterval(this.fadeAudio);
        }
      }, 200);
    }
  }

  stopAudio(): void {
    this.accessVar = 1;
    if (!this.audio.paused && this.accessVar == 1) {
      this.fadeOut();
    }
  }

  fadeOut(): void {
    this.fadeAudio = setInterval(() => {
      if (this.audio.volume !== 0) {
        this.audio.volume -= 0.1
      }

      if (this.audio.volume < 0.003) {
        clearInterval(this.fadeAudio);
      }
    }, 50);

    setTimeout(() => {
      this.audio.pause();
    }, 1000);
  }
}
