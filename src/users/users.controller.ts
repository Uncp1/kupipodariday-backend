import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UserRequest } from 'src/utils/types';
import { Wish } from 'src/wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('me')
  findMe(@Req() req: UserRequest): User {
    return req.user;
  }

  @Get('me/wishes')
  findMyWishes(@Req() req: UserRequest) {
    return this.usersService.findUserWishes(req.user.username);
  }

  @Patch('me')
  updateMe(@Req() req: UserRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':username')
  findByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  findUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.findUserWishes(username);
  }

  @Post('find')
  findMany(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }
}
