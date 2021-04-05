import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {SocketNotification} from 'jamfactory-types';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private wsUrl = environment.JAMFACTORY_WS_URL;
  public socket: WebSocketSubject<SocketNotification>;

  constructor() {
  }

  public connect(reconnect: boolean = false): void {
    if (!this.socket || this.socket.closed) {
      this.socket = this.getNewWebsocket();
    }
  }

  public close(): void {
    this.socket.complete();
  }

  public connected(): boolean {
    return !this.socket.closed;
  }

  private getNewWebsocket(): WebSocketSubject<any> {
    return webSocket({
      url: this.wsUrl,
      closeObserver: {
        next: () => {
          this.socket = undefined;
          this.connect(true);
        }
      },
      deserializer: msg => JSON.parse(msg.data)
    });
  }
}