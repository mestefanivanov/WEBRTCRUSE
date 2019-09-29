import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Ship extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    MMSI: number;

    @Column()
    name: string;

    @Column()
    callSign: string;

    @Column()
    type: string;

    @Column()
    ENI: string;

    @Column()
    description: string;
}
