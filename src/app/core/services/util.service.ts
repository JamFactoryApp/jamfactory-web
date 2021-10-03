import {Injectable} from '@angular/core';
import ArtistObjectSimplified = SpotifyApi.ArtistObjectSimplified;


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {
  }

  getPercentString(val: number, max: number): string {
    return ((val / max) * 100) + '%';
  }

  millisecondsToTimeString(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const seconds = Math.floor(milliseconds / 1000) - minutes * 60;
    return this.stringPadLeft(minutes, '0', 2) + ':' + this.stringPadLeft(seconds, '0', 2);
  }

  stringPadLeft(time: number, pad: string, length: number): string {
    return (new Array(length + 1).join(pad) + time).slice(-length);
  }

  getArtistString(item: ArtistObjectSimplified[]): string {
    const len = item.length;
    let artist: string = item[0].name;

    if (len > 1) {
      for (let i = 1; len > i; i++) {
        artist = artist + ', ' + item[i].name;
      }
    }
    return artist;
  }

}
