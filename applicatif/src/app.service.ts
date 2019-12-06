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
}
