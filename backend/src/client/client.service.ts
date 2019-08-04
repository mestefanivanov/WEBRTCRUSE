import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientService {

    private onlineShips: { clientId: string }[] = [];
    private set: Set<string> = new Set();

    addOnlineShip(clientId: string) {
        const ship = { clientId: clientId };
        this.onlineShips.push(ship);
        this.set.add(clientId);
        return this.onlineShips;
    }

    removeOnlineShip(clientId: string): {}[] {
        const indexOfShip = this.onlineShips
        .findIndex(v => v.clientId === clientId);
        this.onlineShips.splice(indexOfShip, 1);

        return this.onlineShips;
    }

    showOnlineShips() {
        return this.onlineShips;
    }
}

