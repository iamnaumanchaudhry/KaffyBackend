import { BaseEntity, Entity, Unique, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
@Unique(["id"])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    updated_at: Date;

    @Column()
    created_at: Date;

    @Column({ default: false })
    is_verified: boolean;   // OTP

    @Column({ default: false })
    forget_password_request: boolean;

    @Column({ nullable: true })
    otp_secret: string;

}
