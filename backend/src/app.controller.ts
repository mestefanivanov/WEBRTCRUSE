import { Controller, Get } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller()
export class AppController {
  constructor(private readonly appService: RoomService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.addShipToRoom();
//   }
}
