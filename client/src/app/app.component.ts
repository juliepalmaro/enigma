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

    const socketSlug = SocketService.onEvent('slug');
    socketSlug.subscribe(data => {
      console.log(data);
      var slug = data;
    })

    const socketBatch = SocketService.onEvent('batch');
    socketBatch.subscribe(data => {
      console.log(data);
    })

    const socketAlgo = SocketService.onEvent('algo');
    socketAlgo.subscribe(data => {
      console.log(data);
    })
  }
}
