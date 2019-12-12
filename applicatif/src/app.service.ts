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

  getAlgo(): void {
    this.appGateway.sendEventToClient('algo', { algo: '2+2' });
  }
}
