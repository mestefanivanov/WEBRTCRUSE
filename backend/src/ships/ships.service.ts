import { Injectable, NotFoundException } from '@nestjs/common';
import { ShipRepository } from './ship.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './ship.entity';

@Injectable()
export class ShipsService {

    constructor(
        @InjectRepository(ShipRepository)
        private shipRepository: ShipRepository,
    ) {}

    async getAllShips(): Promise<Ship[]> {
        const ships = await this.shipRepository.getAllShips();

        return ships;
    }

    async getShipById(id: number): Promise<Ship> {
        const found = await this.shipRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Ship with ${id} not found`);
        }

        return found;
    }
}
