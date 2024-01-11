import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    ownerId: number,
  ): Promise<Wishlist> {
    const { itemsId, ...data } = createWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    //console.log(items, itemsId);

    const wishlist = await this.wishlistRepository.create({
      ...data,
      owner: { id: ownerId },
      items,
    });
    return this.wishlistRepository.save(wishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find();
  }

  async findOne(id: number): Promise<Wishlist> {
    return await this.wishlistRepository.findOne({ where: { id: id } });
  }

  async verifyUser(userId: number, wishlistId: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: {
        id: wishlistId,
      },
      select: { owner: { id: true } },
    });
    return wishlist.owner.id === userId ? true : false;
  }

  async deleteWishlist(userId: number, wishlistId: number) {
    if (!(await this.verifyUser(userId, wishlistId))) {
      throw new ForbiddenException('Невозможно удалить чужой вишлист');
    }
    return await this.wishlistRepository.delete({ id: wishlistId });
  }

  async updateWishlist(
    userId: number,
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    if (!(await this.verifyUser(userId, wishlistId))) {
      throw new ForbiddenException('Невозможно редактировать чужой вишлист');
    }

    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id }));

    return await this.wishlistRepository.save({
      id: wishlistId,
      ...rest,
      items,
    });
  }
}
