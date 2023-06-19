import { TestBed } from '@angular/core/testing';

import { WebsocketStompService } from './websocket-stomp.service';

describe('WebsocketStompService', () => {
  let service: WebsocketStompService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketStompService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
