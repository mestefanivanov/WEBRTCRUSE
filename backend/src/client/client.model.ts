import { ShipStatus } from 'src/ships/ship-status';

export interface Client {
    id: number;
    MMSI: number;
    name: string;
    callSign: string;
    type: string;
    ENI: string;
    description: string;
    isAvailable: ShipStatus;
    client: string;
}
