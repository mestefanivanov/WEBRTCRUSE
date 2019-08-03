import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RoomService } from './room.service';
import { AppGateway } from './app.gateway';
import { MessageGateway } from './message.gateway';
import { ClientService } from './client/client.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [RoomService, AppGateway, MessageGateway, ClientService],
})
export class AppModule {}

