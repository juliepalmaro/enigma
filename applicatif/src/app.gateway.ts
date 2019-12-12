import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server;

  // communication client -> serveur 
  @SubscribeMessage('test')
  handleMessage(client: Socket, data: string) {
    console.log(data);
  }
  // communication serveur -> client
  public sendEventToClient(str: string, data: any) {
    this.server.clients().emit(str, data);
  }


}
