import { SocketIOClient } from 'socket.io-client';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
export class SocketService {

    private static socket: SocketIOClient;
    private static socketInitialized = false;


    public static initSocket() {
        this.socket = socketIo('http://localhost:3000');
        this.socketInitialized = true;
    }

    public static onEvent(str: string): Observable<any> {
        if (!this.socketInitialized) {
            return null;
        }
        return new Observable<any>(ob => {
            this.socket.on(str, (data: any) => {
                ob.next(data);
            })
        })
    }
}