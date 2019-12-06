import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  constructor() {
    SocketService.initSocket();
    const socket = SocketService.onEvent('test');
    socket.subscribe(data => {
      console.log(data);
    })
  }
}
