import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ShipsService } from './ships.service';
import { Ship } from './ship.entity';

@Controller('ships')
export class ShipsController {
    constructor(private shipsService: ShipsService) {}

    @Get()
    getAllShips(): Promise<Ship[]> {
        return this.shipsService.getAllShips();
    }

    @Get('/:id')
    getAllShipById(@Param('id', ParseIntPipe) id: number): Promise<Ship> {
        return this.shipsService.getShipById(id);
    }
}
