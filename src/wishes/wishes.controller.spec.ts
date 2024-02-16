import { Test, TestingModule } from '@nestjs/testing';
import { CreateWishDto } from './dto/create-wish-dto';
import { Wish } from './entities/wish.entity';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { UserRequest } from 'src/utils/types';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

describe('WishesController', () => {
  let wishesController: WishesController;
  let wishesService: WishesService;
  type PartialUser = Partial<User>;
  const wishesServiceMock = {
    create: jest.fn(),
    updateWish: jest.fn(),
    deleteWish: jest.fn(),
    findRecentWishes: jest.fn(),
    getTopWishes: jest.fn(),
    copyWish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishesController],
      providers: [{ provide: WishesService, useValue: wishesServiceMock }],
    }).compile();

    wishesController = module.get<WishesController>(WishesController);
    wishesService = module.get<WishesService>(WishesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('.create() should call wishesService.create()', async () => {
    const createWishDto: Partial<CreateWishDto> = {
      name: 'testwish',
      description: 'testwish',
      price: 10,
      image: 'https://i.pravatar.cc/150?img=3',
    }; // Mock data for CreateWishDto
    const expectedResult: Partial<Wish> = {
      name: createWishDto.name,
      description: createWishDto.description,
      price: createWishDto.price,
      image: createWishDto.image,
    }; // Mock data for Wish

    const userId = 123; // Mock userID, user and request
    const mockUser: PartialUser = {
      id: userId,
    };
    const mockRequest: Partial<UserRequest> = {
      user: mockUser as User,
    };

    wishesServiceMock.create.mockResolvedValue(expectedResult);
    const result = await wishesController.create(
      createWishDto as CreateWishDto,
      mockRequest as UserRequest,
    );

    expect(wishesServiceMock.create).toHaveBeenCalledWith(
      createWishDto,
      userId,
    );
    expect(result).toEqual(expectedResult);
  });

  it('.updateWish() should call wishesService.updateWish()', async () => {
    const updateWishDto: Partial<UpdateWishDto> = {
      name: 'testwish',
      description: 'testwish',
      price: 10,
      image: 'https://i.pravatar.cc/150?img=3',
    };
    const expectedResult: Partial<Wish> = {
      name: updateWishDto.name,
      description: updateWishDto.description,
      price: updateWishDto.price,
      image: updateWishDto.image,
    };

    const userId = '123';
    const wishId = '456';
    const mockUser: PartialUser = {
      id: +userId,
    };
    const mockRequest: Partial<UserRequest> = {
      user: mockUser as User,
    };

    wishesServiceMock.updateWish.mockResolvedValue(expectedResult);
    const result = await wishesController.updateWish(
      mockRequest as UserRequest,
      wishId,
      updateWishDto as UpdateWishDto,
    );

    expect(wishesServiceMock.updateWish).toHaveBeenCalledWith(
      mockRequest.user.id,
      +wishId,
      updateWishDto,
    );
    expect(result).toEqual(expectedResult);
  });

  it('.deleteWish() should call wishesService.deleteWish()', async () => {
    const userId = '123';
    const wishId = '456';
    const mockUser: PartialUser = {
      id: +userId,
    };
    const mockRequest: Partial<UserRequest> = {
      user: mockUser as User,
    };

    await wishesController.deleteWish(mockRequest as UserRequest, wishId);

    expect(wishesServiceMock.deleteWish).toHaveBeenCalledWith(
      mockRequest.user.id,
      +wishId,
    );
  });

  it('.copyWish() should call wishesService.copyWish()', async () => {
    const userId = '123';
    const wishId = '456';
    const mockUser: PartialUser = {
      id: +userId,
    };
    const mockRequest: Partial<UserRequest> = {
      user: mockUser as User,
    };
    const expectedResult: Partial<Wish> = {
      name: 'Copied Wish',
      description: 'Copied Wish Description',
      price: 500,
      image: 'https://i.pravatar.cc/150?img=5',
    };

    wishesServiceMock.copyWish.mockResolvedValue(expectedResult);

    const result = await wishesController.copyWish(
      wishId,
      mockRequest as UserRequest,
    );

    expect(wishesServiceMock.copyWish).toHaveBeenCalledWith(
      mockRequest.user.id,
      +wishId,
    );

    expect(result).toEqual(expectedResult);
  });

  it('.getRecentWish() should call wishesService.findRecentWishes()', async () => {
    const expectedResult: Partial<Wish>[] = [
      {
        name: 'Recent Wish  1',
        description: 'Recent Wish  1 Description',
        price: 100,
        image: 'https://i.pravatar.cc/150?img=1',
      },
      {
        name: 'Recent Wish  2',
        description: 'Recent Wish  2 Description',
        price: 200,
        image: 'https://i.pravatar.cc/150?img=2',
      },
    ];

    wishesServiceMock.findRecentWishes.mockResolvedValue(expectedResult);
    const result = await wishesController.getRecentWish();

    expect(wishesServiceMock.findRecentWishes).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('.getTopWishes() should call wishesService.getTopWishes()', async () => {
    const expectedResult: Partial<Wish>[] = [
      {
        name: 'Top Wish  1',
        description: 'Top Wish  1 Description',
        price: 300,
        image: 'https://i.pravatar.cc/150?img=3',
      },
      {
        name: 'Top Wish  2',
        description: 'Top Wish  2 Description',
        price: 400,
        image: 'https://i.pravatar.cc/150?img=4',
      },
    ];

    wishesServiceMock.getTopWishes.mockResolvedValue(expectedResult);
    const result = await wishesController.getTopWishes();

    expect(wishesServiceMock.getTopWishes).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });
});
