import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtGuard } from '../guards/jwt.guard';
import { Offer } from './entities/offer.entity';
import { UserRequest } from '../utils/types';
import { CreateOfferDto } from './dto/create-offer.dto';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  create(
    @Req() req: UserRequest,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    return this.offersService.createOffer(req.user.id, createOfferDto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Offer | object> {
    return this.offersService.findOne(+id);
  }
}
