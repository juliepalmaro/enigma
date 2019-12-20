import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppController } from './app.controller';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server;
  // Ensemble des messages à décrypter
  messages = ['uv efdpooft qfqf, uftu', 'qr abzlkkbp mbmb qbpq', 'qr abzlkkbp mbmb qr klrp xp mxp cxfq x jxkdbo'];

  // Ensemble des clés possibles
  maxKey = 50;

  // Ensembles des batchs
  // chaque élément du tableau est un tableau sous la forme [idMessage, cléDébut, cléFin, état]
  // Les différents états sont : undone, in progress, found, not found
  batchs = [];

  clientId = '';

  constructor() {
    // Création de tous les batchs pour tous les messages
    for (let i = 0; i < this.messages.length; i++) {
      for (let j = 1; j < this.maxKey; j += 10) {
          this.batchs.push([i, j, j + 10, 'undone']);
        }
    }
  }

  // communication client -> serveur
  @SubscribeMessage('lost')
  lostMessage(client: Socket, data: any) {
    console.log('perdu', data);
    this.updateStateOfBatch(data.message, data.begin, data.end, 'not found');

    this.clientId = client.id;
    this.getValidSlug();
    this.getBatch();
    this.getAlgo();
  }

  @SubscribeMessage('win')
  winMessage(client: Socket, data: any) {
    // if ('tu deconnes pepe' in data.messageDecrypt) {
      console.log('gagné', data);
      this.updateStateOfBatch(data.message, data.begin, data.end, 'found');

      // Supprimer le messages de la liste et des batchs
      this.deleteMessage(data.message);

      // Envoi de l'arrêt à tous les clients
      this.sendEventToClient('stop', { message: data.message });

      this.clientId = client.id;
      this.getValidSlug();
      this.getBatch();
      this.getAlgo();
    // }
  }

  // communication serveur -> client
  // public sendEventToClient(str: string, data: any) {
  //   this.server.to(this.clientId).emit(str, data);
  // }

  public sendEventToClient(str: string, data: any) {
    this.server.clients().emit(str, data);
  }

  // Connexion d'un client
  handleConnection(client: Socket, ...args: []) {
    console.log('client connecté ' + client.id);
    this.clientId = client.id;
    this.getValidSlug();
    this.getAlgo();
    this.getBatch();
  }


  // FONCTIONS
   // Récupération du premier batch disponible (qui a l'état undone)
  getFirstBatchUndone(): number {
    for (let i = 0; i < this.batchs.length; i++) {
        if (this.batchs[i][3] === 'undone') {
          return i;
        }
    }
    return null;
  }

  // Modification de l'état d'un batch
  updateStateOfBatch(message, begin, end, state): void {
    const index = this.messages.indexOf(message);
    let find = false;
    let i = 0;
    while (!find && i < this.batchs.length) {
      if (this.batchs[i][0] === index && this.batchs[i][1] === begin && this.batchs[i][2] === end) {
        this.batchs[i][3] = state;
        find = true;
      }
      i += 1;
    }
  }

  // Suppression d'un message
  deleteMessage(message): void {
    const index = this.messages.indexOf(message);
    let i = 0;
    while (i < this.batchs.length) {
      if (this.batchs[i][0] === index) {
        delete(this.batchs[i]);
      }
      i++;
    }

    // Suppression des éléments vides du tableau
    this.batchs = this.batchs.filter((el) => {
      if (el != null) {
        return el;
      }
    });
    this.messages.slice(index, 1);
  }


  // SERVICES
  // Envoi du slug
  getValidSlug(): void {
    // console.log('slug client connecté ' + this.clientId);
    this.sendEventToClient('slug', { slug: 'Tu deconnes pepe' });
  }

  // Envoi l'algo pour décoder le message
  // L'algo retourne la clé de début si le message est décodé et -1 sinon
  getAlgo(): void {
    // console.log('algo client connecté ' + this.clientId);
    const algorithme = (message, begin, end, slug) => {
      const regex = new RegExp(slug, 'i');
      for (let i = begin; i <= end; i++) {
        let newMessage = '';
        const messageTab = Array.from(message);
        messageTab.forEach((car: string) => {
          const ascii = car.charCodeAt(0);
          if (ascii >= 'A'.charCodeAt(0) && ascii <= 'Z'.charCodeAt(0)) {
            const calcul = (ascii - i - 'A'.charCodeAt(0)) % 26;
            if (calcul > 0) {
              car = String.fromCharCode(calcul + 'A'.charCodeAt(0));
            } else {
              car = String.fromCharCode('Z'.charCodeAt(0) + calcul);
            }
          } else if (ascii >= 'a'.charCodeAt(0) && ascii <= 'z'.charCodeAt(0)) {
            const calcul = (ascii - i - 'a'.charCodeAt(0)) % 26;
            if (calcul > 0) {
              car = String.fromCharCode(calcul + 'a'.charCodeAt(0));
            } else {
              car = String.fromCharCode('z'.charCodeAt(0) + calcul);
            }
          }
          newMessage += car;
        });
        // console.log('new message', newMessage);
        if (newMessage.search(regex) !== -1) {
          return [i, newMessage];
        }
      }
      return -1;
    };
    this.sendEventToClient('algo', { algo: algorithme.toString() });
  }

  // Envoi du message chiffré + clé de début + clé de fin
  getBatch(): void {
    const ind = this.getFirstBatchUndone();
    if (ind != null) {
      const keys = this.batchs[ind];
      this.sendEventToClient('batch', { message: this.messages[keys[0]], begin: keys[1], end: keys[2] });
      this.batchs[ind][3] = 'in progress';
    } else {
      //
    }
  }
}
