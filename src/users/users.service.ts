import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { HashService } from '../hash/hash.service';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../utils/exceptions';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findMany(query): Promise<User[] | undefined> {
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
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username: username } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, username } = createUserDto;

    const userSearch = await this.findByUsername(username);
    if (userSearch) {
      throw new UserAlreadyExistsException();
    }

    try {
      const hash = await this.hashService.hash(password);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hash,
      });
      await this.userRepository.insert(user);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (updateUserDto.password) {
      const hash = await this.hashService.hash(updateUserDto.password);
      updateUserDto.password = hash;
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async findUserWishes(username: string): Promise<Wish[]> {
    const user = await this.userRepository.findOne({
      where: {
        wishes: {
          owner: {
            username: username,
          },
        },
      },
      select: {
        wishes: {
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
        },
      },
      relations: {
        wishes: {
          owner: true,
          offers: true,
        },
      },
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user.wishes;
  }
}
