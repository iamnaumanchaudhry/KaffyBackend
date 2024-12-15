import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./order";
import { Product } from "./product";

// OrderItem Entity
@Entity("order_items")
export class OrderItem extends BaseEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Order, (order) => order.order_items)
  @JoinColumn({ name: "orderId" })
  order: Order;

  @ManyToOne(() => Product, (product) => product.order_items)
  @JoinColumn({ name: "productId" })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
