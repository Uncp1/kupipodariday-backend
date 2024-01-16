import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish-dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    console.log(ownerId);

    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      relations: {
        owner: true,
      },
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Wish> {
    return await this.wishesRepository.findOne({
      where: { id: id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        link: true,
        image: true,
        price: true,
        raised: true,
        copied: true,
        description: true,
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
        offers: {
          id: true,
          createdAt: true,
          updatedAt: true,
          amount: true,
          hidden: true,
        },
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });
  }

  async findRecentWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      relations: {
        offers: true,
        owner: true,
      },
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 40,
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      relations: {
        offers: true,
        owner: true,
      },
    });
  }

  async verifyUser(userId: number, wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: wishId,
      },
      select: {
        owner: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      relations: {
        owner: true,
        offers: true,
      },
    });
    return wish.owner.id === userId ? true : false;
  }

  async deleteWish(userId: number, wishId: number) {
    if (!(await this.verifyUser(userId, wishId))) {
      throw new ForbiddenException('Невозможно удалить чужой подарок');
    }
    return await this.wishesRepository.delete({ id: wishId });
  }

  async updateWish(
    userId: number,
    wishId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    if (!(await this.verifyUser(userId, wishId))) {
      throw new ForbiddenException('Нельзя редактировать чужие подарки');
    }

    await this.wishesRepository.update(wishId, updateWishDto);
    return await this.findOne(wishId);
  }

  async copyWish(userId: number, wishId: number): Promise<Wish> {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок c id ${wishId} не найден');
    }

    const newWish = await this.wishesRepository.create({
      ...wish,
      owner: { id: userId },
    });

    wish.copied++;
    return await this.wishesRepository.save(newWish);
  }
}
