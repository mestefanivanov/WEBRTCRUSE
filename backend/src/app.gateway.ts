import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { ClientService } from './client/client.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayDisconnect {

  constructor(
    private readonly roomService: RoomService,
    private readonly clientService: ClientService
  ) { }

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialiazed');
  }
  //--------------------------------------
  // SECOND DEVICE 
  //--------------------------------------
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client* connected: ${client.id}`);
  }

  @SubscribeMessage('online')
  handleOnlineShip(client: Socket, data: { id: number, name: string, desciption: string, client: string }) {
    var onlineShip = data;
    onlineShip.client = client.id;
    this.clientService.addOnlineShip(onlineShip);
  }

  @SubscribeMessage('showOnlineShips')
  handleOnlineShips(client: Socket) {
    var onlineShips = this.clientService.showOnlineShips();
    client.emit('onlineShips', onlineShips);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`);
    this.roomService.removeShipFromRoom(client.id);
    var onlineShips = this.clientService.removeOnlineShip(client.id);
    client.emit('disconnect', onlineShips);
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
    client.broadcast.to(room).emit('joinedRoom', { client: client.id, room: room });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    this.roomService.removeShipFromRoom(client.id);
    client.emit('leftRoom', room);
  }
  
  @SubscribeMessage('offer')
  handlePeerOffer(client: Socket, data: { data: object, room: string }) {
    var shipsInRoom = this.roomService.showShipsFromRoom(data.room);
    var lastJoinedShip = shipsInRoom[shipsInRoom.length - 1];
    client.to(lastJoinedShip.clientId).emit('offer', { data: data.data, room: data.room, clientId: client.id });
  }

  @SubscribeMessage('response')
  handlePeerResponse(client: Socket, data: { data: object, room: string, clientId: string }) {
    client.to(data.clientId).emit('response', data.data);
  }
}