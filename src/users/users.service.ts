import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findMany(query): Promise<User[] | undefined> {
    //?
    const user = await this.userRepository.find({
      where: [
        {
          username: query,
        },
        { email: query },
      ],
    });

    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user); //placeholder
  }

  async findUserWishes(username: string): Promise<Wish[]> {
    const user = await this.findByUsername(username);
    return user.wishes;
  }
}
