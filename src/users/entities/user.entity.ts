import { IsEmail, IsUrl, Max, Min } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { BaseEntity } from 'src/utils/entities';

@Entity()
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  @Min(2)
  @Max(30)
  username: string;

  @Column({
    default: 'Пока ничего не рассказал о себе',
  })
  @Min(2)
  @Max(200)
  about: string;

  @Column({
    default: '',
  })
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
