import {Injectable, isDevMode, OnDestroy} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, Subscription, switchAll, tap,} from 'rxjs';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {devLog} from '../../shared/utils';
import {retryBackoff} from "backoff-rxjs";
import {reconnectBackoffConfig} from "./backoff.config";
import {webSocket} from "rxjs/webSocket";

@Injectable({
    providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
    private webSocket$: WebSocketSubject<any> | undefined;
    private webSocketSubscription: Subscription | undefined;
    private messageSubject$: BehaviorSubject<any> = new BehaviorSubject([]);
    private messages$: Observable<any> = this.messageSubject$.pipe(
        switchAll(),
        catchError((e) => {
            if (isDevMode()) {
                console.log('[Websocket] message error', e);
            }
            return of(e);
        })
    );

    ngOnDestroy(): void {
        this.webSocketSubscription?.unsubscribe();
    }

    connect(): void {
        if (!this.webSocket$ || this.webSocket$.closed) {
            this.webSocket$ = this.getNewWebsocket();
            devLog('Created new websocket');
        }

        this.webSocketSubscription = this.webSocket$
            .pipe(tap(devLog), switchAll(), retryBackoff(reconnectBackoffConfig))
            .subscribe({
                next: (msg: any) => this.messageSubject$.next(msg),
                error: err => devLog(err)
            })
    }

    sendMessage(msg: any): void {
        this.webSocket$?.next(msg)
    }

    private getNewWebsocket(): WebSocketSubject<any> {
        return webSocket({
            url: 'wss://ws.postman-echo.com/raw',
            openObserver: {
                next: () => devLog('[Websocket]: connection ok')
            },
            closeObserver: {
                next: () => {
                    devLog('[Websocket]: connection closed');
                    this.webSocket$ = undefined
                }
            }
        })
    }

    public getMessages(): Observable<any> {
        return this.messages$;
    }
}
