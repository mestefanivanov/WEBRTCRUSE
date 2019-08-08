import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RoomService } from './room.service';
// import { MessageGateway } from './message.gateway';
import { ClientService } from './client/client.service';
import { ShipsModule } from './ships/ships.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ShipsModule,
  ],
  controllers: [AppController],
  providers: [RoomService, ClientService],
})
export class AppModule {}

