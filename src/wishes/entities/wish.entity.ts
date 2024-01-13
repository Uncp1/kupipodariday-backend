import { Column, Entity, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { Min, Max, IsUrl, IsInt } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { BaseEntity } from 'src/utils/entities';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @Min(1)
  @Max(250)
  name: string;

  @IsUrl()
  @Column()
  link: string;

  @IsUrl()
  @Column()
  image: string;

  @Column()
  @IsInt()
  price: number;

  @Column({ default: 0 })
  raised: number;

  @Column()
  @Min(1)
  @Max(1024)
  description: string;

  @Column({ default: 0 })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (list) => list.items)
  wishlists: Wishlist[];
}
