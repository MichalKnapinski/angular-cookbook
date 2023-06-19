import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsocketStompComponent } from './websocket-stomp.component';

describe('WebsocketStompComponent', () => {
  let component: WebsocketStompComponent;
  let fixture: ComponentFixture<WebsocketStompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebsocketStompComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebsocketStompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
