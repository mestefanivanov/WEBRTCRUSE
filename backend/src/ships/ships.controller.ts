import { Controller, Get, Param, ParseIntPipe, Query, ValidationPipe, Patch, Body } from '@nestjs/common';
import { ShipsService } from './ships.service';
import { Ship } from './ship.entity';
import { GetShipsFilterDto } from './dto/get-ships-fiter.dto';

@Controller('ships')
export class ShipsController {
    constructor(private shipsService: ShipsService) { }

    @Get()
    getAllShips(@Query() filterDto: GetShipsFilterDto): Promise<Ship[]> {
        return this.shipsService.getAllShips(filterDto);
    }

    @Get('/:id')
    getAllShipById(@Param('id', ParseIntPipe) id: number): Promise<Ship> {
        return this.shipsService.getShipById(id);
    }

    @Patch('/:id/isAvailable')
    updateShip(
        @Param('id', ParseIntPipe) id: number,
        @Body('IsAvailable') IsAvailable: boolean,
        ): Promise<Ship> {
        return this.shipsService.updateShip(id, IsAvailable);
    }
}
