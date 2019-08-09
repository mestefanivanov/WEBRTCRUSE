import { Injectable } from '@nestjs/common';
import { json } from 'body-parser';

@Injectable()
export class ClientService {

    private onlineShips: { id: number, name: string, desciption: string, client: string }[] = [];

    addOnlineShip(onlineShip: { id: number, name: string, desciption: string, client: string }) {
        if (this.onlineShips.some(person => person.client === onlineShip.client)) {
            return this.onlineShips;
        }
        this.onlineShips.push(onlineShip);
        
        return this.onlineShips;
    }

    removeOnlineShip(clientId: string): {}[] {
        const indexOfShip = this.onlineShips
            .findIndex(v => v.client === clientId);
        this.onlineShips.splice(indexOfShip, 1);

        return this.onlineShips;
    }

    showOnlineShips() {
        return this.onlineShips;
    }

}

