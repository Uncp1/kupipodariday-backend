import { Test, TestingModule } from '@nestjs/testing';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { UserRequest } from 'src/utils/types';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

describe('WishlistsController', () => {
  let wishlistsController: WishlistsController;
  let wishlistsService: WishlistsService;
  type PartialUser = Partial<User>;
  const wishlistsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    deleteWishlist: jest.fn(),
    updateWishlist: jest.fn(),
    copyWish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistsController],
      providers: [
        { provide: WishlistsService, useValue: wishlistsServiceMock },
      ],
    }).compile();

    wishlistsController = module.get<WishlistsController>(WishlistsController);
    wishlistsService = module.get<WishlistsService>(WishlistsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('.create() should call WishlistsService.create()', async () => {
    const userId = 123; // Mock userID, user and request
    const mockUser: PartialUser = {
      id: userId,
    };
    const mockRequest: Partial<UserRequest> = {
      user: mockUser as User,
    };

    const createWishlistDto: Partial<CreateWishlistDto> = {
      name: 'testwish',
      description: 'testwish',
      itemsId: [1, 2, 3],
      image: 'https://i.pravatar.cc/150?img=3',
    };
    const expectedResult: Partial<Wishlist> = {
      name: createWishlistDto.name,
      description: createWishlistDto.description,
      items: createWishlistDto.itemsId.map((id) => ({
        id,
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
      })),
    }; // Mock data for Wishlist and CreateWishlistDto

    wishlistsServiceMock.create.mockResolvedValue(expectedResult);
    const result = await wishlistsController.create(
      createWishlistDto as CreateWishlistDto,
      mockRequest as UserRequest,
    );

    expect(wishlistsServiceMock.create).toHaveBeenCalledWith(
      createWishlistDto,
      userId,
    );
    expect(result).toEqual(expectedResult);
  });

  it('findAll() should call WishlistsService.findAll()', async () => {
    const expectedResult: Wishlist[] = [
      // ... mock Wishlist data ...
    ];

    wishlistsServiceMock.findAll.mockResolvedValue(expectedResult);
    const result = await wishlistsController.findAll();

    expect(wishlistsServiceMock.findAll).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('findOne() should call WishlistsService.findOne()', async () => {
    const wishlistId = '1'; // Mock wishlist ID
    const expectedResult: Partial<Wishlist> = {
      id: 1,
      name: 'testwish',
      description: 'testwish',
      items: [],
      image: 'https://i.pravatar.cc/150?img=3',
    };

    wishlistsServiceMock.findOne.mockResolvedValue(expectedResult);
    const result = await wishlistsController.findOne(wishlistId);

    expect(wishlistsServiceMock.findOne).toHaveBeenCalledWith(+wishlistId);
    expect(result).toEqual(expectedResult);
  });

  it('deleteWishlist() should call WishlistsService.deleteWishlist()', async () => {
    const userId = 123; // Mock user ID
    const wishlistId = '1'; // Mock wishlist ID

    wishlistsServiceMock.deleteWishlist.mockResolvedValue({ deleted: true });
    const result = await wishlistsController.deleteWishlist(
      { user: { id: userId } } as UserRequest,
      wishlistId,
    );

    expect(wishlistsServiceMock.deleteWishlist).toHaveBeenCalledWith(
      userId,
      +wishlistId,
    );
    expect(result).toEqual({ deleted: true });
  });

  it('updateWishlist() should call WishlistsService.updateWishlist()', async () => {
    const userId = 123; // Mock user ID
    const wishlistId = '1'; // Mock wishlist ID
    const mockUser: PartialUser = {
      id: userId,
    };

    const updateWishlistDto: Partial<UpdateWishlistDto> = {
      name: 'testwish',
      description: 'testwish',
      itemsId: [1, 2, 3],
      image: 'https://i.pravatar.cc/150?img=3',
    };
    const expectedResult: Partial<Wishlist> = {
      name: updateWishlistDto.name,
      description: updateWishlistDto.description,
      items: updateWishlistDto.itemsId.map((id) => ({
        id,
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
      })),
    };

    wishlistsServiceMock.updateWishlist.mockResolvedValue(expectedResult);
    const result = await wishlistsController.updateWishlist(
      { user: { id: userId } } as UserRequest,
      wishlistId,
      updateWishlistDto as UpdateWishlistDto,
    );

    expect(wishlistsServiceMock.updateWishlist).toHaveBeenCalledWith(
      userId,
      +wishlistId,
      updateWishlistDto,
    );
    expect(result).toEqual(expectedResult);
  });
});
