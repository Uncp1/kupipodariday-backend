import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UserRequest } from 'src/utils/types';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: UserRequest,
  ) {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Delete(':id')
  deleteWishlist(@Req() req: UserRequest, @Param('id') id: string) {
    return this.wishlistsService.deleteWishlist(req.user.id, +id);
  }

  @Patch(':id')
  updateWishlist(
    @Req() req: UserRequest,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateWishlist(
      req.user.id,
      +id,
      updateWishlistDto,
    );
  }
}
