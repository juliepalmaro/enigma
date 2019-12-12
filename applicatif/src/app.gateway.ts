import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('test')
  handleMessage(client: Socket, payload: string): string {
    return 'test';
  }

  public sendEventToClient(str: string, data: any) {
    this.server.clients().emit(str, data);
  }
}
