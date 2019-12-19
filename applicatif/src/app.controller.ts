import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) { }
  constructor(private readonly appGateway: AppGateway) { }

  @Get()
  getInfos(): void {
    // this.appService.getValidSlug();
    // this.appService.getBatch();
    // this.appGateway.deleteMessage('uv efdpooft qfqf, uftu');
    // this.appGateway.getFirstBatchUndone();
  }
}
