import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntity } from '../../utils/entities';
import { IsInt } from 'class-validator';

@Entity()
export class Offer extends BaseEntity {
  @Column()
  @IsInt()
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, {
    onDelete: 'CASCADE',
  })
  item: Wish;
}
