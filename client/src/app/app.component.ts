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
  title = '';
  slug = '';
  batch = '';
  algo = '';
  messageBatch = '';
  keyDebut = '';
  keyFin = '';
  jwt = '';

  username: string;
  password: string;

  constructor() {
    SocketService.initSocket();

    const socketSlug = SocketService.onEvent('slug');
    socketSlug.subscribe(data => {
      this.slug = data.slug;
    });

    const socketAlgo = SocketService.onEvent('algo');
    socketAlgo.subscribe(data => {
      this.algo = data.algo;
    });

    const socketBatch = SocketService.onEvent('batch');
    socketBatch.subscribe(data => {
      this.messageBatch = data.message;
      console.log('message', data.message);

      this.keyDebut = data.begin;
      console.log('keydebut', data.begin);

      this.keyFin = data.end;
      console.log('keyfin', data.end);

      this.launchAlgo(this.algo, this.messageBatch, this.keyDebut, this.keyFin, this.slug)
    });
    // // message que le client envoie au serveur pour lui indiquer qu'il a réussi à déchiffrer le message
    // SocketService.emit('found', { success: "j'ai trouvé!! " });

    // // message que le client envoie au serveur pour lui indiquer qu'il n'a pas réussi à déchiffrer le message avec le batch fourni
    // SocketService.emit('lost', { failed: "je n'ai pas trouvé..." });

    // message que le client envoie au serveur pour lui transmettre son token.
    SocketService.emit('jwt', { jwt: this.jwt });

  }

  launchAlgo(algo: string, message: string, begin: string, end: string, slug: string) {
    const algorithme = eval(algo);
    const retourAlgo = algorithme(message, begin, end, slug);
    if (retourAlgo === -1) {
      SocketService.emit('lost', { message, begin, end, failed: 'je n\'ai pas trouvé...' });
    } else {
      SocketService.emit('win', { messageDecrypt: retourAlgo, message, begin, end, success: 'j\'ai trouvé !! ' });
    }
    return;
  }

  onFormSubmit(userform: NgForm) {
    console.log(this.username);

    axios.post('http://127.0.0.1:8080/api/login.php',
      {
        login: this.username,
        password: this.password
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
