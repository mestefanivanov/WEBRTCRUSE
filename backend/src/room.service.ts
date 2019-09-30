import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {

  private joinedShips: {clientId: string, roomId: string}[] = [];

  addShipToRoom(clientId: string, roomId: string): {}[] {
    const ship = {clientId: clientId, roomId: roomId};
    this.joinedShips.push(ship);

    return this.joinedShips;
  }

  removeShipFromRoom(clientId: string): {}[] {
    const indexOfShip = this.joinedShips
    .findIndex(v => v.clientId === clientId);
    this.joinedShips.splice(indexOfShip, 1);

    return this.joinedShips;
  }

  showShipsFromRoom(roomid: string){
    var filteredArray =  this.joinedShips.filter((joinedShips) => {
      return joinedShips.roomId === roomid;
    });

    return filteredArray;
  }
}
