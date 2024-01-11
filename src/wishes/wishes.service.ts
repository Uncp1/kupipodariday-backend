import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish-dto';

@Injectable()
export class WishesService {
  constructor(
    //   private dataSource: DataSource, ???
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    //refactor later
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find();
  }

  async findRecentWish(): Promise<Wish[]> {
    return this.wishesRepository.find({
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
}
