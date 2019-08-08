import { Injectable, NotFoundException } from '@nestjs/common';
import { ShipRepository } from './ship.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AppGateway } from '../app.gateway';
import { Ship } from './ship.entity';

@Injectable()
export class ShipsService {

    constructor(
        @InjectRepository(ShipRepository)
        private shipRepository: ShipRepository,
        private gateway: AppGateway
    ) {}

    async getAllShips(): Promise<Ship[]> {
        const ships = await this.shipRepository.getAllShips();

        return ships;
    }

    async getShipById(id: number): Promise<Ship> {
        const found = await this.shipRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Ship with ${id} not found`)
        }
        this.gateway.wss.emit('info', found)

        return found;
    }
}
