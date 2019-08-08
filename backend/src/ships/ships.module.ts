import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipsController } from './ships.controller';
import { AppGateway } from '../app.gateway';
import { ShipsService } from './ships.service';
import { ShipRepository } from './ship.repository';
import { Ship } from './ship.entity';
import { ClientService } from '../client/client.service';
import { RoomService } from '../room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipRepository])
  ],
  controllers: [ShipsController],
  providers: [AppGateway, ShipsService, ClientService,RoomService],
})
export class ShipsModule {}
