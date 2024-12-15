import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { OrderItem } from "./order_item";

// Order Entity
@Entity("orders")
export class Order  extends BaseEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  is_paid: boolean;

  @Column({ default: "" })
  phone: string;

  @Column({ default: "" })
  address: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  order_items: OrderItem[];
}
