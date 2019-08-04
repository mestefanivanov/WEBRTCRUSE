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
    ) {}
  @WebSocketServer() wss: Server

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialiazed')
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`)
    var roomResult = this.roomService.removeShipFromRoom(client.id)
    console.log(roomResult)
    var result = this.clientService.removeOnlineShip(client.id)
    console.log(result)
    client.emit('disconnect', result)
  }

  // handleConnection(client: Socket, ...args: any[]) {
  //   this.logger.log(`Client connected: ${client.id}`)
  //   //client.emit('connection', { clientId: client.id })
  // }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client* connected: ${client.id}`)
    var result = this.clientService.addOnlineShip(client.id)
    console.log(result)
    for (let item of result.values()) client.emit('connection', item);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    console.log(room);
    client.join(room);
    var result = this.roomService.addShipToRoom(client.id, room)
    // client.in(room).emit('joinedRoom', { client: client.id, room: room });
    client.broadcast.to(room).emit('joinedRoom', { client: client.id, room: room });
    console.log(result)
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    console.log(`room ${room}`);
    var a =client.leave(room);
    console.log(a);
    console.log(client.id)
    client.emit('leftRoom', room);
    var result = this.roomService.removeShipFromRoom(client.id)
    console.log(result)
  }

  @SubscribeMessage('showJoinedShips')
  handleJoinedShips(client: Socket, room: string) {
    var joinedShips = this.roomService.showShipsFromRoom(room)
    client.emit('joinedShips', joinedShips);
    console.log(joinedShips)
  }

  @SubscribeMessage('offer')
  handlePeerOffer(client: Socket, data: {data:object, room: string}) {
    console.log(data.data)
    console.log('******')
    console.log(`offer: ${client.id}`)
    var clients=this.roomService.showShipsFromRoom(data.room)
    //var clientId= clients.find(x => x.clientId !== client.id);
    //Get last joined user to emmit offers just to him
    var user= clients.pop();
    client.to(user.clientId).emit('offer', {data:data.data , room: data.room, clientId: client.id})
  }

  @SubscribeMessage('response')
  handlePeerResponse(client: Socket, data: {data:object, room: string, clientId: string}) {
    console.log(data.room);
    console.log(`answerer: ${client.id}`);
    console.log(`Offerer Id:${data.clientId}`)
    client.to(data.clientId).emit('response', data.data)
  }

  @SubscribeMessage('message')
  handleClientMessage(client: Socket, { clientId: clientId, message: message }) {
    console.log(clientId)
    console.log(message)
    client.to(clientId).emit('recieveMessage', message)
  }
}

