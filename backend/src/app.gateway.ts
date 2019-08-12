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
    //var result = this.clientService.addOnlineShip(client.id);
    //console.log(result);
    //client.emit('connection', client.id);
  }

  @SubscribeMessage('online')
  handleOnlineShip(client: Socket, data: { id: number, name: string, desciption: string, client: string }) {
    //console.log(data);
    var onlineShip = data;
    onlineShip.client = client.id;
    //console.log(onlineShip);
    var onlineShips = this.clientService.addOnlineShip(onlineShip);
    //console.log(onlineShips.length);

    client.emit('onlineShips', onlineShips);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`);
    //Removing client from room FIRST DEVICE
    var shipsInRoom = this.roomService.removeShipFromRoom(client.id);
    //console.log(shipsInRoom);
    //Removing client from room SECOND DEVICE
    var onlineShips = this.clientService.removeOnlineShip(client.id);
    //console.log(onlineShips);

    client.emit('disconnect', onlineShips);
  }

  @SubscribeMessage('message')
  handleClientMessage(client: Socket, { clientId: clientId, message: message }) {
    console.log(clientId);
    console.log(message);

    client.to(clientId).emit('recieveMessage', message);
  }
  // ------------------------------------------
  // FIRST DEVICE
  // ------------------------------------------
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    //console.log(room);
    client.join(room);
    var result = this.roomService.addShipToRoom(client.id, room);
    //console.log(result);

    client.broadcast.to(room).emit('joinedRoom', { client: client.id, room: room });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    //console.log(`room ${room}`);
    client.leave(room);
    //console.log(client.id);
    var result = this.roomService.removeShipFromRoom(client.id);
    //console.log(result);

    client.emit('leftRoom', room);
  }
  
  @SubscribeMessage('offer')
  handlePeerOffer(client: Socket, data: { data: object, room: string }) {
    var shipsInRoom = this.roomService.showShipsFromRoom(data.room);
    //Get last joined user to emmit offers just to him
    var lastJoinedShip = shipsInRoom[shipsInRoom.length - 1];

    client.to(lastJoinedShip.clientId).emit('offer', { data: data.data, room: data.room, clientId: client.id });
  }

  @SubscribeMessage('response')
  handlePeerResponse(client: Socket, data: { data: object, room: string, clientId: string }) {
    console.log(data.room);
    console.log(`answerer: ${client.id}`);
    console.log(`Offerer Id:${data.clientId}`);

    client.to(data.clientId).emit('response', data.data);
  }

  //Thats just for checking 
  //-------------------------------
  @SubscribeMessage('showJoinedShips')
  handleJoinedShips(client: Socket, room: string) {
    var joinedShips = this.roomService.showShipsFromRoom(room);
    console.log(joinedShips);

    client.emit('joinedShips', joinedShips);
  }
  //-------------------------------
}

