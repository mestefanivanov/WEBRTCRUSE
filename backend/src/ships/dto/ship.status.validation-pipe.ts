import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ShipStatus } from '../ship-status';

export class ShipStatusValidationPipe implements PipeTransform {
   readonly allowedStatuses = [
        ShipStatus.TAKEN,
        ShipStatus.AVAILABLE,
   ];

   transform(value: any) {
       if (!this.isStatusValid(value)) {
           throw new BadRequestException('Invalid Status');
       }

       return value;
   }

   private isStatusValid(status: any) {
       const idx = this.allowedStatuses.indexOf(status);

       return idx !== -1;
   }

}
