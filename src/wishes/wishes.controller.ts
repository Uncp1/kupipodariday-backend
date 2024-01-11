import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Wish } from './entities/wish.entity';
import { UserRequest } from 'src/utils/types';
import { CreateWishDto } from './dto/create-wish-dto';
import { UpdateWishDto } from './dto/update-wish.dto';

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
    return this.wishesService.findRecentWishes();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.getTopWishes();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Wish> {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteWish(@Req() req: UserRequest, @Param('id') id: string) {
    return this.wishesService.deleteWish(req.user.id, +id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWish(
    @Req() req: UserRequest,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateWish(req.user.id, +id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: string, @Req() req: UserRequest) {
    return this.wishesService.copyWish(req.user.id, +id);
  }
}
