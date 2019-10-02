import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ShipRepository } from './ship.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Ship } from './ship.entity';
import { GetShipsFilterDto } from './dto/get-ships-fiter.dto';
import { ShipStatus } from './ship-status';

@Injectable()
export class ShipsService {

    constructor(
        @InjectRepository(ShipRepository)
        private shipRepository: ShipRepository,
    ) { }

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

    async updateShip(id: number, status: ShipStatus): Promise<Ship> {
        const ship = await this.getShipById(id);
        if (ship.status === status) {
            throw new ForbiddenException(`Ship is already ${status}`);
        }
        ship.status = status;
        await ship.save();
        return ship;
    }
}
