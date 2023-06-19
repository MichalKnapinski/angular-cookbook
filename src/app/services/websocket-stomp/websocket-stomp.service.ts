import {Injectable} from '@angular/core';
import {RxStomp} from "@stomp/rx-stomp";
import {websocketStompConfig} from "./websocket-stomp.config";

export function stompWebsocketServiceFactory(): WebsocketStompService {
  const rxStomp: WebsocketStompService = new WebsocketStompService();
  rxStomp.configure(websocketStompConfig);
  rxStomp.activate();
  return rxStomp;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketStompService extends RxStomp {
  constructor() {
    super();
  }
}
