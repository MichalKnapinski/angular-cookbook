import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WebsocketComponent} from './components/websocket/websocket.component';
import {WebsocketStompComponent} from './components/websocket-stomp/websocket-stomp.component';
import {CommonModule} from "@angular/common";
import {stompWebsocketServiceFactory, WebsocketStompService} from "./services/websocket-stomp/websocket-stomp.service";

@NgModule({
  declarations: [AppComponent, WebsocketComponent, WebsocketStompComponent],
  imports: [BrowserModule, AppRoutingModule, CommonModule],
  providers: [
    {
      provide: WebsocketStompService,
      useFactory: stompWebsocketServiceFactory
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
