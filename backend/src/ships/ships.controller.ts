import { Controller, Get, Param, ParseIntPipe, Query, ValidationPipe, Patch, Body, Put } from '@nestjs/common';
import { ShipsService } from './ships.service';
import { Ship } from './ship.entity';
import { GetShipsFilterDto } from './dto/get-ships-fiter.dto';
import { ShipStatus } from './ship-status';

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

    @Put('/:id/status')
    updateShip(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') IsAvailable: ShipStatus,
        ): Promise<Ship> {
        return this.shipsService.updateShip(id, IsAvailable);
    }
}
