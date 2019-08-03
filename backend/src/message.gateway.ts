import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ClientService } from './client/client.service';

@WebSocketGateway()
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly clientService: ClientService) {}

  private logger: Logger = new Logger('MessageGateway')

  afterInit(server: Server) {
    this.logger.log('Initialiazed***')
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`)
    var result = this.clientService.removeOnlineShip(client.id)
    client.emit('disconnect', result)
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client* connected: ${client.id}`)
    var result = this.clientService.addOnlineShip(client.id)
    console.log(result)
    for (let item of result.values()) client.emit('connection', item);
  }

  @SubscribeMessage('message')
  handleClientMessage(client: Socket, { clientId: clientId, message: message }) {
    console.log(clientId)
    console.log(message)
    client.to(clientId).emit('recieveMessage', message)
  }
}
