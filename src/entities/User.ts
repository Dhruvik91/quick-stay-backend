import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

export enum UserType {
  PG = "PG",
  RENTAL = "Rental",
  HOSTEL = "Hostel",
  CO_LIVING = "Co-living",
}

export enum PropertyType {
  BOYS="Boys",
  GIRLS="Girls",
  BOTH="Both",
}
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, })
  name!: string;

  @Column({ type: "varchar", length: 255, })
  property_name!: string;

  @Column({
    type: "enum",
    enum: UserType,
    default: UserType.PG,
  })
  type!: UserType;

  @Column({
    type: "enum",
    enum: PropertyType,
    default: PropertyType.BOYS,
  })
  property_type!: PropertyType;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "decimal", precision: 3, scale: 2, nullable: true })
  rating?: number;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "boolean", default: false })
  verified!: boolean;

  @Column({ type: "simple-array", default: [] })
  amenities!: string[];

  @Column({type: "varchar", length: 255, nullable: true})
  email!: string;

  @Column({type: "varchar", length: 255, nullable: true})
  phone!: string;

  @Column({type: "varchar", length: 255, nullable: true})
  google_map_link!: string

  @Column({type: "varchar", length: 255, nullable: true})
  slug!: string;

  @Column({type: "simple-array", default: []})
  images!: string[]

  @Column({ type: "boolean", default: true })
  is_active!: boolean;

  @Column({ type: "boolean", default: false })
  is_deleted!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.property_name) {
      this.slug = this.property_name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }
}
