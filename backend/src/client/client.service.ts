import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientService {

    private onlineShips: { clientId: string }[] = [];

    addOnlineShip(clientId: string): string {
        const ship = { clientId: clientId };
        this.onlineShips.push(ship);

        return `Ship with ${clientId} is online`
    }

    removeOnlineShip(clientId: string): string {
        const indexOfShip = this.onlineShips
        .findIndex(v => v.clientId === clientId);
        this.onlineShips.splice(indexOfShip, 1)

        return 'Successfully removed';
    }

    showOnlineShips() {
        return this.onlineShips;
    }
}
