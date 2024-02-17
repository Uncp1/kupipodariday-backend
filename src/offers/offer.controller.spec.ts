import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { UserRequest } from 'src/utils/types';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

describe('OfferController', () => {
  let offersController: OffersController;
  let offersService: OffersService;
  type PartialUser = Partial<User>;
  const offerServiceMock = {
    createOffer: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [{ provide: OffersService, useValue: offerServiceMock }],
    }).compile();

    offersController = module.get<OffersController>(OffersController);
    offersService = module.get<OffersService>(OffersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('.create() should call offersService.createOffer()', async () => {
    const userId = 123; // Mock userID, user and request
    const mockUser: PartialUser = {
      id: userId,
    };
    const mockRequest: Partial<UserRequest> = {
      user: mockUser as User,
    };

    const createOfferDto: Partial<CreateOfferDto> = {
      amount: 100,
      hidden: false,
      itemId: 1,
    };

    const expectedResult: Partial<Offer> = {
      amount: createOfferDto.amount,
      user: mockUser as User,
      item: {
        id: createOfferDto.itemId,
        name: 'Test Wish',
        link: 'https://example.com',
        image: 'https://i.pravatar.cc/150?img=3',
        price: 100,
        raised: 0,
        description: 'Test description',
        copied: 0,
        owner: mockUser as User,
        offers: [],
        wishlists: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }; // Mock data for Offer and CreateOfferDto
    offerServiceMock.createOffer.mockResolvedValue(expectedResult);
    const result = await offersController.create(
      mockRequest as UserRequest,
      createOfferDto as CreateOfferDto,
    );

    expect(offerServiceMock.createOffer).toHaveBeenCalledWith(
      userId,
      createOfferDto as CreateOfferDto,
    );
    expect(result).toEqual(expectedResult);
  });

  it('.findAll() should call offersService.findAll()', async () => {
    const expectedResult: Offer[] = [];

    offerServiceMock.findAll.mockResolvedValue(expectedResult);
    const result = await offersController.findAll();

    expect(offerServiceMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('.findOne() should call offersService.findOne()', async () => {
    const offerId = '1'; // Mock offer ID
    const userId = 123;
    const mockUser: PartialUser = {
      id: userId,
    };

    const expectedResult: Partial<Offer> = {
      amount: 100,
      user: mockUser as User,
      item: {
        id: 1,
        name: 'Test Wish',
        link: 'https://example.com',
        image: 'https://i.pravatar.cc/150?img=3',
        price: 100,
        raised: 0,
        description: 'Test description',
        copied: 0,
        owner: mockUser as User,
        offers: [],
        wishlists: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    offerServiceMock.findOne.mockResolvedValue(expectedResult);
    const result = await offersController.findOne(offerId);

    expect(offerServiceMock.findOne).toHaveBeenCalledWith(+offerId);
    expect(result).toEqual(expectedResult);
  });
});
