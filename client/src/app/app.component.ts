import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { NgForm } from '@angular/forms';

import axios from "axios";

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

  username: string;
  password: string;
  private information: string[];

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
      console.log(this.test(data.algo));
      this.algo = data.algo;
    })
    // message que le client envoie au serveur pour lui indiquer qu'il a réussi à déchiffrer le message
    SocketService.emit('found', { success: "j'ai trouvé!! " });

    // message que le client envoie au serveur pour lui indiquer qu'il n'a pas réussi à déchiffrer le message avec le batch fourni
    SocketService.emit('lost', { failed: "je n'ai pas trouvé..." });

    // message que le client envoie au serveur pour lui transmettre son token.
    SocketService.emit('jwt', { jwt: "" });

  }

  test(algo: string) {
    return eval(algo);
  }

  onFormSubmit(userform: NgForm) {

    axios({
      method: 'get',
      url: 'http://127.0.0.1:8080/api/login.php',
      data: {
        login : this.username,
        password: this.password
      }
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }



  resetUserForm(userform: NgForm) {
    console.log(this.username);
    console.log(this.password);
  }

}
