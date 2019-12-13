import { Injectable } from '@nestjs/common';
import { AppGateway } from './app.gateway';

@Injectable()
export class AppService {
  // Ensemble des messages à décrypter
  messages = ['whvw, wx ghfrqqhv shsh', 'fg pqoazzqe bqbq, fqef'];

  // Ensemble des clés possibles
  maxKey = 50;

  // Ensembles des batchs sous la forme d'un dictionnaire
  // avec pour nom le message et pour valeur un tableau comprenant chaque plage de clés
  // pour chaque plage de clé, on met un état (non testé, ne marche pas, trouvé)
  batchs = [];

  constructor(
    private appGateway: AppGateway,
  ) {
    // Création de tous les batchs pour tous les messages
    for (let i = 0; i < this.maxKey; i += 10) {
      this.messages.forEach(message => {
        this.batchs.push([i, i + 10, 'undone']);
      });
    }
  }

  // Récupération du premier batch disponible (qui a l'état undone)
  getFirstBatchUndone(): number {
    for (let i = 0; i < this.batchs.length; i++) {
      if (this.batchs[i][2] === 'undone') {
        return i;
      }
    }
    return null;
  }

  // Envoi du slug
  getValidSlug(): void {
    this.appGateway.sendEventToClient('slug', { slug: 'Tu déconnes pépé !' });
  }

  // Envoi du message chiffré + clé de début + clé de fin
  getBatch(): void {
    const ind = this.getFirstBatchUndone();
    if (ind != null) {
      const keys = this.batchs[ind];
      this.appGateway.sendEventToClient('batch', { message: this.messages[ind], begin: keys[0], end: keys[1] });
      this.batchs[ind][3] = 'in progress';
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
