import { Module } from '@nestjs/common';
import { ShipsController } from './ships.controller';
import { ShipsService } from './ships.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipRepository } from './ship.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipRepository])
  ],
  controllers: [ShipsController],
  providers: [ShipsService],
})
export class ShipsModule {}
