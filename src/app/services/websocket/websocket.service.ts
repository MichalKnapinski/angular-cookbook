import {Injectable} from '@angular/core';
import {fromEvent, map, merge, Observable, of, Subject, Subscription,} from 'rxjs';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {devLog} from '../../shared/utils';
import {retryBackoff} from "backoff-rxjs";
import {reconnectBackoffConfig} from "./backoff.config";
import {webSocket} from "rxjs/webSocket";

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    private webSocket$: WebSocketSubject<any> | undefined;
    private webSocketSubscription: Subscription | undefined;
    private messageSubject$: Subject<any> = new Subject();
    isOffline: boolean = false;
    networkStatus$: Subscription = Subscription.EMPTY;

    constructor() {
        this.checkNetworkStatus();
    }

    connect(): void {
        if (!this.webSocket$ || this.webSocket$.closed) {
            this.webSocket$ = this.getNewWebsocket();
            devLog('Created new websocket');
        }

        this.webSocketSubscription = this.webSocket$
            .pipe(retryBackoff(reconnectBackoffConfig))
            .subscribe({
                next: (msg: any) => this.messageSubject$.next(msg),
                error: err => devLog(err)
            })
    }

    sendMessage(msg: any): void {
        if (this.isOffline) {
            this.webSocketSubscription?.unsubscribe();
            this.webSocket$?.unsubscribe()
        }
        this.webSocket$?.next(msg)
    }

    public getMessages(): Observable<any> {
        return this.messageSubject$.asObservable();
    }

    private getNewWebsocket(): WebSocketSubject<any> {
        return webSocket({
            url: 'wss://ws.postman-echo.com/raw',
            openObserver: {
                next: () => devLog('[Websocket]: connection ok')
            },
            closeObserver: {
                next: () => {
                    devLog('[Websocket]: connection closed. Reconnecting.');
                    this.reconnect();
                }
            }
        })
    }

    private reconnect(): void {
        this.webSocket$?.unsubscribe();
        this.webSocketSubscription?.unsubscribe();
        this.webSocket$ = undefined;
        this.connect()
    }

    private checkNetworkStatus() {
        this.isOffline = navigator.onLine;
        this.networkStatus$ = merge(
            of(null),
            fromEvent(window, 'online'),
            fromEvent(window, 'offline')
        )
            .pipe(map(() => navigator.onLine))
            .subscribe(status => {
                devLog('online', status);
                this.isOffline = status;
            });
    }
}
