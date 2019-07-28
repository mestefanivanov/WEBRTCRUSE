import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly roomService: RoomService) { }
  @WebSocketServer() wss: Server

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialiazed')
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`)
    var result = this.roomService.removeShipFromRoom(client.id)
    console.log(result)
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
    client.emit('connection', { clientId: client.id })
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, text: string): WsResponse<string> {
    return { event: 'msgToClient', data: text };
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
    console.log(room);
    client.leave(room);
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
    client.broadcast.to(data.room).emit('offer', {data:data.data , room: data.room})
  }

  @SubscribeMessage('response')
  handlePeerResponse(client: Socket, data: {data:object, room: string}) {
    console.log(data.room)
    console.log(`answer: ${client.id}`)
    client.broadcast.to(data.room).emit('response', data.data)
  }

  // @SubscribeMessage('stream')
  // handlePeerStream(client: Socket, stream: any) {
  //   console.log(stream)
  //   console.log(`stream: ${client.id}`)
  //   // client.in('2').emit('stream', stream)
  //   client.emit('stream', stream)
  // }
}

