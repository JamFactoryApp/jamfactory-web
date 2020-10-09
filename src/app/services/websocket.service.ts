import {Injectable} from '@angular/core';
import {WebSocketSubject} from 'rxjs/internal-compatibility';
import {EMPTY, Observable, Subject, timer} from 'rxjs';
import {catchError, delayWhen, retryWhen, switchAll, tap} from 'rxjs/operators';
import {webSocket} from 'rxjs/webSocket';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private httpOptions = {
    withCredentials: true
  };
  private wsUrl = 'ws://' + environment.JAMFACTORY_API_URL + '/ws';

  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(
    switchAll(),
    catchError(e => {
      throw e;
    })
  );
  private RECONNECT_INTERVAL = 1;

  constructor() {
  }

  public connect(cfg: { reconnect: boolean } = {reconnect: false}): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : o => o,
        tap({
          error: error => console.log(error),
        }), catchError(_ => EMPTY));
      this.messagesSubject$.next(messages);
      this.sendMessage("HAllo")
    }
  }

  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(
      retryWhen(errors => errors.pipe(tap(val => console.log('[WSServcice]: Try to reconnect', val)),
        delayWhen(_ => timer(this.RECONNECT_INTERVAL))
      ))
    );
  }

  private getNewWebSocket(): WebSocketSubject<any> {
    return webSocket({
      url: this.wsUrl,
      closeObserver: {
        next: () => {
          console.log('[WSServiec]: connection closed');
          this.socket$ = undefined;
          this.connect({reconnect: true});
        }
      }
    });
  }

  sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  close() {
    this.socket$.complete();
  }
}
