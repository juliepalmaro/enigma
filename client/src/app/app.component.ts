import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "";
  slug = "";
  batch = "";
  algo = "";

  constructor() {
    SocketService.initSocket();
    const socket = SocketService.onEvent('test');
    socket.subscribe(data => {
      console.log(data);
      this.title = data.test;
    })

    const socketSlug = SocketService.onEvent('slug');
    socketSlug.subscribe(data => {
      console.log(data);
      this.slug = data.slug;
    })

    const socketBatch = SocketService.onEvent('batch');
    socketBatch.subscribe(data => {
      console.log(data);
      this.batch = data.batch;
    })

    const socketAlgo = SocketService.onEvent('algo');
    socketAlgo.subscribe(data => {
      console.log(data);
      this.algo = data.algo;
    })
  }
}
