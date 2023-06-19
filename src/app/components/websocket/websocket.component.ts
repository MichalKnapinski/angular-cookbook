import {Component, OnDestroy} from '@angular/core';
import {WebsocketService} from "../../services/websocket/websocket.service";
import {Observable, scan, Subscription, switchAll, timer} from "rxjs";

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss'],
})
export class WebsocketComponent implements OnDestroy {
  messages$: Observable<any> | undefined;
  private timerSubscription: Subscription | undefined;

  constructor(private websocketService: WebsocketService) {
    websocketService.connect();
    this.timerSubscription = timer(1000, 1000).subscribe((tick: number) => {
      this.websocketService.sendMessage(`Message ${tick}`);
    });
    this.messages$ = websocketService.getMessages().pipe(
        switchAll(),
        scan((acc: any[], value: any) => {
          acc.push(value);
          return acc
        }, [])
    )

    this.messages$.subscribe(message => {
      console.log(message)
    })
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
