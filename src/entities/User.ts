import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, })
  name!: string;

  @Column({
    type: "enum",
    enum: ["PG", "Rental", "Hostel", "Co-living"],
    default: "Rental",
  })
  type!: "PG" | "Rental" | "Hostel" | "Co-living";

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "decimal", precision: 3, scale: 2, nullable: true })
  rating?: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  image_url?: string;

  @Column({ type: "boolean", default: false })
  verified!: boolean;

  @Column({ type: "simple-array", default: [] })
  amenities!: string[];

  @Column({type: "varchar", length: 255, nullable: true})
  email!: string;

  @Column({type: "varchar", length: 255, nullable: true})
  phone!: string;
  
  @Column({ type: "boolean", default: false })
  is_active!: boolean;

  @Column({ type: "boolean", default: false })
  is_deleted!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;
}
