import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Wish } from './entities/wish.entity';
import { UserRequest } from 'src/utils/types';
import { CreateWishDto } from './dto/create-wish-dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req: UserRequest) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get()
  findAll(): Promise<Wish[]> {
    return this.wishesService.findAll();
  }

  @Get('recent')
  getRecentWish(): Promise<Wish[]> {
    return this.wishesService.findRecentWish();
  }
}
