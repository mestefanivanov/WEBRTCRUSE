import { Repository, EntityRepository } from 'typeorm';
import { Ship } from './ship.entity';
import { GetShipsFilterDto } from './dto/get-ships-fiter.dto';

@EntityRepository(Ship)
export class ShipRepository extends Repository<Ship> {

    async getAllShips(filterDto: GetShipsFilterDto) {
        const { status } = filterDto;
        const query = this.createQueryBuilder('ship');

        if (status) {
            query.where('ship.status = :status', { status });
        }

        const ships = await query.getMany();
        return ships;
    }
}
