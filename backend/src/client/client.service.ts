import { Injectable } from '@nestjs/common';
import { Client } from './client.model';

@Injectable()
export class ClientService {

    private onlineShips: Client[] = [];

    addOnlineShip(onlineShip: Client ): Client[] {
        if (this.onlineShips.some(person => person.client === onlineShip.client)) {
            return this.onlineShips;
        }
        this.onlineShips.push(onlineShip);

        return this.onlineShips;
    }

    removeOnlineShip(clientId: string): Client[] {
        const indexOfShip = this.onlineShips
            .findIndex(v => v.client === clientId);
        this.onlineShips.splice(indexOfShip, 1);

        return this.onlineShips;
    }

    showOnlineShips(): Client[] {
        return this.onlineShips;
    }
}
