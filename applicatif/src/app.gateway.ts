import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('slug')
  handleMessage(client: Socket, payload: string): string {
    return 'Tu déconnes pépé';
  }

  public sendEventToClient(str: string, data: any) {
    this.server.client().emit(str, data);
  }
}
