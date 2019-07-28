import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RoomService } from './room.service';
import { AppGateway } from './app.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [RoomService, AppGateway],
})
export class AppModule {}

