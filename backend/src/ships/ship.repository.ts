import { Repository, EntityRepository } from 'typeorm';
import { Ship } from './ship.entity';
import { GetShipsFilterDto } from './dto/get-ships-fiter.dto';

@EntityRepository(Ship)
export class ShipRepository extends Repository<Ship> {

    async getAllShips(filterDto: GetShipsFilterDto) {
        const { isAvailable } = filterDto;
        const query = this.createQueryBuilder('ship');

        if (isAvailable) {
            query.where('ship.isAvailable = :isAvailable', {isAvailable});
        }

        const ships = await query.getMany();
        return ships;
    }
}
