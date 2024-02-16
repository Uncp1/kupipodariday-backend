import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRequest } from 'src/utils/types';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  const usersServiceMock = {
    findAll: jest.fn(),
    createUser: jest.fn(),
    findUserWishes: jest.fn(),
    update: jest.fn(),
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('.create() should call usersService.createUser()', async () => {
    const createUserDto: Partial<CreateUserDto> = {
      username: 'testuser',
      about: 'testuser',
      avatar: 'https://i.pravatar.cc/150?img=3',
      email: 'user@test.com',
      password: 'strongpassword',
    }; // Mock data for CreateUserDto
    const expectedResult: Partial<User> = {
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
      avatar: createUserDto.avatar,
      about: createUserDto.about,
    }; // Mock data for User

    usersServiceMock.createUser.mockResolvedValue(expectedResult);

    expect(
      await usersController.create(createUserDto as CreateUserDto),
    ).toEqual(expectedResult as User);
    expect(usersServiceMock.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('.findAll() should call UsersService.findAll()', async () => {
    const expectedResult: User[] = []; // Mock data for User array

    usersServiceMock.findAll.mockResolvedValue(expectedResult);

    expect(await usersController.findAll()).toEqual(expectedResult);
    expect(usersServiceMock.findAll).toHaveBeenCalled();
  });

  it('.findMe() should call UsersService.findMe()', async () => {
    const mockUser: Partial<User> = {
      username: 'testuser',
      email: 'user@test.com',
      password: 'strongpassword',
      avatar: 'https://i.pravatar.cc/150?img=3',
      about: 'testuser',
    };

    const mockRequest = {
      user: mockUser as User,
    };

    // Mock the findMe method to return the user from the request
    jest
      .spyOn(usersController, 'findMe')
      .mockImplementation((req: UserRequest) => req.user);

    const result = await usersController.findMe(mockRequest as UserRequest);

    expect(result).toEqual(mockUser as User);
  });

  it('.findMyWishes() should call UsersService.findMyWishes() with the correct username', async () => {
    const mockRequest = { user: { username: 'testuser' } };
    const findUserWishesSpy = jest.spyOn(usersService, 'findUserWishes');

    await usersController.findMyWishes(mockRequest as UserRequest);

    expect(findUserWishesSpy).toHaveBeenCalledWith(mockRequest.user.username);
  });

  it('.updateMe() should call usersService.update() with the correct user id and updateUserDto', async () => {
    const mockRequest = { user: { id: 1 } };
    const mockUpdateUserDto: Partial<UpdateUserDto> = {
      username: 'newusername',
    };
    const updateSpy = jest.spyOn(usersService, 'update');

    await usersController.updateMe(
      mockRequest as UserRequest,
      mockUpdateUserDto as UpdateUserDto,
    );

    expect(updateSpy).toHaveBeenCalledWith(
      mockRequest.user.id,
      mockUpdateUserDto,
    );
  });

  it('.findByUsername() should call usersService.findByUsername with the correct username', async () => {
    const mockUsername = 'testuser';
    const findByUsernameSpy = jest.spyOn(usersService, 'findByUsername');

    await usersController.findByUsername(mockUsername);

    expect(findByUsernameSpy).toHaveBeenCalledWith(mockUsername);
  });

  it('.findUserWishes() should call usersService.findUserWishes with the correct username', async () => {
    const mockUsername = 'testuser';
    const findUserWishesSpy = jest.spyOn(usersService, 'findUserWishes');

    await usersController.findUserWishes(mockUsername);

    expect(findUserWishesSpy).toHaveBeenCalledWith(mockUsername);
  });

  it('.findByUsername() should handle the case when the user is not found', async () => {
    const mockUsername = 'nonexistentuser';
    const findByUsernameSpy = jest
      .spyOn(usersService, 'findByUsername')
      .mockResolvedValue(null);

    try {
      await usersController.findByUsername(mockUsername);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(404);
      expect(error.message).toBe('Пользователь не найден');
    }

    expect(findByUsernameSpy).toHaveBeenCalledWith(mockUsername);
  });
});
