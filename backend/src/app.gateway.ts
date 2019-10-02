import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { ClientService } from './client/client.service';
import { Client } from './client/client.model';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayDisconnect {

  constructor(
    private readonly roomService: RoomService,
    private readonly clientService: ClientService,
  ) { }

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialiazed');
  }
   // --------------------------------------
   // SECOND DEVICE
   // --------------------------------------
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client* connected: ${client.id}`);
    const onlineShips = this.clientService.showOnlineShips();
    if (onlineShips.length === 0) {
      client.emit('noOnlineShips', 'TODO');
    }
  }

  @SubscribeMessage('online')
  handleOnlineShip(
    client: Socket, data: Client) {
    const onlineShip = data;
    onlineShip.client = client.id;
    this.clientService.addOnlineShip(onlineShip);
  }

  @SubscribeMessage('showOnlineShips')
  handleOnlineShips(client: Socket) {
    const onlineShips = this.clientService.showOnlineShips();
    client.emit('onlineShips', onlineShips);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`);
    this.roomService.removeShipFromRoom(client.id);
    const fuckingShip = this.clientService.findShipByClientId(client.id)
    const onlineShips = this.clientService.removeOnlineShip(client.id);
    this.logger.log(fuckingShip);
    this.wss.emit('disconnect', fuckingShip);
  }

  @SubscribeMessage('message')
  handleClientMessage(client: Socket, { clientId: clientId, message: message }) {
    client.to(clientId).emit('recieveMessage', message);
  }
  // ------------------------------------------
  // FIRST DEVICE
  // ------------------------------------------
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.roomService.addShipToRoom(client.id, room);
    client.broadcast.to(room).emit('joinedRoom', { client: client.id, room });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    this.roomService.removeShipFromRoom(client.id);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('offer')
  handlePeerOffer(client: Socket, data: { data: object, room: string }) {
    const shipsInRoom = this.roomService.showShipsFromRoom(data.room);
    const lastJoinedShip = shipsInRoom[shipsInRoom.length - 1];
    client.to(lastJoinedShip.clientId).emit('offer', { data: data.data, room: data.room, clientId: client.id });
  }

  @SubscribeMessage('response')
  handlePeerResponse(client: Socket, data: { data: object, room: string, clientId: string }) {
    client.to(data.clientId).emit('response', data.data);
  }
}
