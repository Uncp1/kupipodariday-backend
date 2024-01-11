import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async createOffer(
    userId: number,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const { amount, itemId, hidden } = createOfferDto;

    const wish = await this.wishesRepository.findOne({
      where: { id: itemId },
      select: { owner: { id: true } },
    });

    if (wish.owner.id === userId) {
      throw new ForbiddenException('Нельзя скинуться на свой подарок');
    }

    const { price, raised } = wish;

    wish.raised = wish.raised + amount;

    if (wish.raised > wish.price) {
      throw new ForbiddenException(
        `Для покупки подарка не хватает только ${price - raised}р.`,
      );
    }

    try {
      await this.wishesRepository.save(wish);
      const newOffer = await this.offerRepository.save({
        amount,
        hidden,
        item: { id: itemId },
        user: { id: userId },
      });
      return newOffer;
    } catch (err) {
      return err.detail;
    }
  }
  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findOne(id: number): Promise<Offer | object> {
    const offer = await this.offerRepository.findOne({ where: { id: id } });
    if (offer.hidden) {
      return new Object();
    }
    return offer;
  }
}
