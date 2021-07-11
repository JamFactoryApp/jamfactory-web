import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {SocketNotification} from '@jamfactoryapp/jamfactory-types';
import {retry} from 'rxjs/operators';
import {JamsessionStore} from '../stores/jamsession.store';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private wsUrl = environment.JAM_WS_PROTOCOL + location.hostname + (location.port ? ':' + environment.JAM_API_PORT : '') + '/ws';
  public socket: WebSocketSubject<SocketNotification>;

  constructor(private router: Router) {
  }

  public connect(handler: (wsMessage: any) => void): void {
    if (!this.socket || this.socket.closed) {
      this.socket = this.getNewWebsocket();
    }
    this.socket.asObservable().subscribe(
      message => handler(message),
      error => this.handleError(error, handler),
      () => console.log('closed'));
  }

  private handleError(error: any, handler: (wsMessage: any) => void): void {
    if (this.router.isActive('/jam', false)) {
      setTimeout(() => this.connect(handler), 5000);
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.complete();
    }
  }

  public connected(): boolean {
    return !this.socket.closed;
  }

  private getNewWebsocket(): WebSocketSubject<any> {
    return webSocket({
      url: this.wsUrl,
      deserializer: msg => JSON.parse(msg.data)
    });
  }
}
