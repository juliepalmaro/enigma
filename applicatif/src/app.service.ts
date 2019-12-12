import { Injectable } from '@nestjs/common';
import { AppGateway } from './app.gateway';

@Injectable()
export class AppService {

  constructor(
    private appGateway: AppGateway,
  ) {
    //
  }

  getHello(): string {
    this.appGateway.sendEventToClient('test', { test: 'hello' });
    return 'Hello World!';
  }

  getValidSlug(): void {
    this.appGateway.sendEventToClient('slug', { slug: 'Tu déconnes pépé !' });
  }

  getBatch(): void {
    // Récupération du message chiffré

    // Récupération de clé de début et la clé de fin
  }

  getAlgo(): void {
    // Renvoie de l'algo pour décoder le message
    this.appGateway.sendEventToClient('algo', { algo: '2+2' });
  }
}
