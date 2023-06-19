import {Component, OnDestroy} from '@angular/core';
import {WebsocketService} from "../../services/websocket/websocket.service";
import {scan, Subscription, timer} from "rxjs";

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss'],
})
export class WebsocketComponent implements OnDestroy {
  private timerSubscription: Subscription | undefined;
  private messagesSubscription: Subscription | undefined;

  constructor(private websocketService: WebsocketService) {
    websocketService.connect();
    this.timerSubscription = timer(1000, 1000)
        .subscribe((tick: number) => {
      this.websocketService.sendMessage(`Message ${tick}`);
    });

    this.messagesSubscription = this.websocketService.getMessages()
        .pipe(
            scan((acc:any, val: any) => [...acc, val], []))
        .subscribe(message => {
      console.log('got message: ', message);
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.messagesSubscription?.unsubscribe();
  }
}
