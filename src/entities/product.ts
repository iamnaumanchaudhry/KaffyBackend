import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BaseEntity
} from "typeorm";
import { OrderItem } from "./order_item";
import { Size } from "./size";
import { Category } from "./category";

@Entity("products")
export class Product  extends BaseEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  stock: number;

  @Column("decimal")
  price: number;

  @Column("text", { array: true })
  images: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @ManyToOne(() => Size, (size) => size.products)
  @JoinColumn({ name: "sizeId" })
  size: Size;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  order_items: OrderItem[];
}
