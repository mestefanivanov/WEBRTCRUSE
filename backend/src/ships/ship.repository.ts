import { Repository, EntityRepository } from "typeorm";
import { Ship } from "./ship.entity";

@EntityRepository(Ship)
export class ShipRepository extends Repository<Ship>{

}
