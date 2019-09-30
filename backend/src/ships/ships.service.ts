import { Injectable, NotFoundException } from '@nestjs/common';
import { ShipRepository } from './ship.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './ship.entity';
import { GetShipsFilterDto } from './dto/get-ships-fiter.dto';

@Injectable()
export class ShipsService {

    constructor(
        @InjectRepository(ShipRepository)
        private shipRepository: ShipRepository,
    ) {}

    async getAllShips(filterDto: GetShipsFilterDto): Promise<Ship[]> {
        const ships = await this.shipRepository.getAllShips(filterDto);

        return ships;
    }

    async getShipById(id: number): Promise<Ship> {
        const found = await this.shipRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Ship with ${id} not found`);
        }

        return found;
    }

    async updateShip(id: number, isAvailable: boolean): Promise<Ship> {
       const ship = await this.getShipById(id);
       ship.isAvailable = isAvailable;
       ship.save();

       return ship;
    }
}
