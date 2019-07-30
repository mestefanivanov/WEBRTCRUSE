import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {

  private joinedShips: {clientId: string, roomId: string}[]=[];

  addShipToRoom(clientId: string, roomId: string): string {
    const ship = {clientId: clientId, roomId: roomId};
    this.joinedShips.push(ship);

    return 'Success';
  }

  removeShipFromRoom(clientId: string): string {
    const indexOfShip = this.joinedShips.findIndex(v => v.clientId === clientId);
    this.joinedShips.splice(indexOfShip, 1)

    return 'Success';
  }

  showShipsFromRoom(roomid: string){
    var filteredArray =  this.joinedShips.filter(function(joinedShips) {
      return joinedShips.roomId === roomid;
    });

    return filteredArray;
  }
}
