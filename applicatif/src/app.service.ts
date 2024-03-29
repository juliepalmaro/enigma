import { Injectable } from '@nestjs/common';
import { AppGateway } from './app.gateway';

@Injectable()
export class AppService {
  // Ensemble des messages à décrypter
  messages = ['whvw, wx ghfrqqhv shsh', 'fg pqoazzqe bqbq, fqef'];

  // Ensemble des clés possibles
  maxKey = 50;

  // Ensembles des batchs
  // chaque élément du tableau est un tableau sous la forme [idMessage, cléDébut, cléFin, état]
  // Les différents états sont : undone, in progress, found, not found
  batchs = [];

  constructor(
    private appGateway: AppGateway,
  ) {
    // Création de tous les batchs pour tous les messages
    for (let i = 0; i < this.messages.length; i++) {
      for (let j = 0; j < this.maxKey; j += 10) {
          this.batchs.push([i, j, j + 10, 'undone']);
        }
      }
    console.log(this.batchs);
  }

  // Récupération du premier batch disponible (qui a l'état undone)
  getFirstBatchUndone(): number {
    for (let i = 0; i < this.batchs.length; i++) {
        console.log('search ' + this.batchs[i]);
        if (this.batchs[i][3] === 'undone') {
          return i;
        }
      }
    return null;
  }

  // Envoi du slug
  getValidSlug(): void {
    this.appGateway.sendEventToClient('slug', { slug: 'Tu deconnes pepe !' });
  }

  // Envoi du message chiffré + clé de début + clé de fin
  getBatch(): void {
    const ind = this.getFirstBatchUndone();
    if (ind != null) {
      const keys = this.batchs[ind];
      this.appGateway.sendEventToClient('batch', { message: this.messages[keys[0]], begin: keys[1], end: keys[2]});
      this.batchs[ind][3] = 'in progress';
      console.log(this.batchs);
    } else {
      //
    }
  }

  // Envoi l'algo pour décoder le message
  // L'algo retourne la clé de début si le message est décodé et -1 sinon
  getAlgo(): void {
    const algorithme = (message, begin, end, slug) => {
      const regex = new RegExp(slug, 'i');
      for (let i = begin; i <= end; i++) {
        let newMessage = '';
        const messageTab = Array.from(message);
        messageTab.forEach((car: string) => {
          const ascii = car.charCodeAt(0);
          if (ascii >= 'A'.charCodeAt(0) && ascii <= 'Z'.charCodeAt(0)) {
            const calcul = (ascii - begin - 'A'.charCodeAt(0)) % 26;
            car = String.fromCharCode(calcul + 'A'.charCodeAt(0));
          } else if (ascii >= 'a'.charCodeAt(0) && ascii <= 'z'.charCodeAt(0)) {
            const calcul = (ascii - begin - 'a'.charCodeAt(0)) % 26;
            car = String.fromCharCode(calcul + 'a'.charCodeAt(0));
          }
          newMessage += car;
        });
        if (newMessage.search(regex) !== -1) {
          return [i, newMessage];
        }
      }
      return -1;
    };
    //console.log('algo', algorithme.toString());
    this.appGateway.sendEventToClient('algo', { algo: algorithme.toString() });
  }
}
