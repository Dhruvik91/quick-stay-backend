import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export interface Accommodation {
  id: string;
  name: string;
  type: "PG" | "Rental" | "Hostel" | "Co-living";
  address: string;
  price: number;
  rating?: number;
  description?: string;
  imageUrl?: string;
  verified: boolean;
  amenities: string[];
  contact?: {
    phone?: string;
    email?: string;
  };
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
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
  imageUrl?: string;

  @Column({ type: "boolean", default: false })
  verified!: boolean;

  @Column({ type: "simple-array", default: [] })
  amenities!: string[];

  @Column({ type: "json", nullable: true })
  contact?: {
    phone?: string;
    email?: string;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
