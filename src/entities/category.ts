import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity
} from "typeorm";
import { Product } from "./product";

@Entity("categories")
export class Category extends BaseEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
