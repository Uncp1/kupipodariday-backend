import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Min, Max, IsUrl, IsOptional } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntity } from 'src/utils/entities';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Min(1)
  @Max(250)
  name: string;

  @IsOptional()
  @Column({
    default: 'Описание пока не добавлено',
  })
  @Max(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.wishlists, {
    cascade: true,
  })
  @JoinTable()
  items: Wish[];
}
