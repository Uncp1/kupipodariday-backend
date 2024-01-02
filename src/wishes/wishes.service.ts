import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    //   private dataSource: DataSource, ???
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async findAll(): Promise<Wish[]> {
    return this.wishesRepository.find();
  }
}
