import { BaseEntity, Entity, Unique, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('token')
@Unique(["user_id"])
export class Token extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    refresh_token: string;

    @Column()
    ip: string;

    @Column({ default: 'PostmanRuntime/7.29.0' })
    user_agent: string;

    @Column({ default: true })
    is_valid: boolean;

    @Column('uuid')
    user_id: string;

}
