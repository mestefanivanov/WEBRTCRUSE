import { Repository, EntityRepository } from "typeorm";
import { Ship } from "./ship.entity";

@EntityRepository(Ship)
export class ShipRepository extends Repository<Ship>{

    async getAllShips(){
        const query = this.createQueryBuilder('ship');

        const ships = await query.getMany()
        return ships;
    }
}
