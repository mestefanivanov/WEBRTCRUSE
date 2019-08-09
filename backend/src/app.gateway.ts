import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayDisconnect, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { ClientService } from './client/client.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayDisconnect {
  private peers: {}[]
  constructor(
    private readonly roomService: RoomService,
    private readonly clientService: ClientService
  ) { }
  @WebSocketServer() wss: Server

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialiazed');
  }
  //--------------------------------------
  // SECOND DEVICE 
  //--------------------------------------
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client* connected: ${client.id}`);
    // var result = this.clientService.addOnlineShip(client.id)
    //console.log(result)
    //client.emit('connection', client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect: ${client.id}`);
    //Removing client from room FIRST DEVICE
    var roomResult = this.roomService.removeShipFromRoom(client.id);
    console.log(roomResult);
    var result = this.clientService.removeOnlineShip(client.id);
    console.log(result);

    client.emit('disconnect', result);
  }

  @SubscribeMessage('message')
  handleClientMessage(client: Socket, { clientId: clientId, message: message }) {
    console.log(clientId);
    console.log(message);

    client.to(clientId).emit('recieveMessage', message);
  }

  @SubscribeMessage('online')
  handleOnlineShip(client: Socket, data: { id: number, name: string, desciption: string, client: string }) {
    console.log(data);
    var a = data;
    a.client = client.id;
    console.log(a);
    var onlineShips = this.clientService.addOnlineShip(a);
    console.log(onlineShips.length);

    client.emit('onlineShips', onlineShips);
  }

  // ------------------------------------------
  // FIRST DEVICE
  // ------------------------------------------

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    console.log(room);
    client.join(room);
    var result = this.roomService.addShipToRoom(client.id, room);
    console.log(result);
    // client.in(room).emit('joinedRoom', { client: client.id, room: room });

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

  @SubscribeMessage('showJoinedShips')
  handleJoinedShips(client: Socket, room: string) {
    var joinedShips = this.roomService.showShipsFromRoom(room);
    console.log(joinedShips);

    client.emit('joinedShips', joinedShips);
  }

  @SubscribeMessage('signal')
  handleSignal(client: Socket, data: object) {
    console.log('******************************')
    console.log(data)
  }


  @SubscribeMessage('offer')
  handlePeerOffer(client: Socket, data: { data: object, room: string, peer: object }) {
    //console.log(data.peer)
    console.log('******')
    // console.log(`offer: ${client.id}`)
    console.log(data.peer)
    var clients = this.roomService.showShipsFromRoom(data.room)
    //Get last joined user to emmit offers just to him
    var user = clients[clients.length - 1]
    // var a = this.peers.indexOf(data.peer)
    // console.log('stefan')
    // console.log(a)
  
      // if(data.peer,)
      client.to(user.clientId).emit('offer', { data: data.data, room: data.room, clientId: client.id })
  }

  @SubscribeMessage('response')
  handlePeerResponse(client: Socket, data: { data: object, room: string, clientId: string }) {
    console.log(data.room);
    console.log(`answerer: ${client.id}`);
    console.log(`Offerer Id:${data.clientId}`)
    client.to(data.clientId).emit('response', data.data)
  }
}

