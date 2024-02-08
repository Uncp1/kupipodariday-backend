import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  const usersServiceMock = {
    findAll: jest.fn(),
    createUser: jest.fn(),
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

  it('.create() should call usersService.create()', async () => {
    const mockUser = {
      username: 'testuser',
      about: 'testuser',
      avatar: 'https://i.pravatar.cc/150?img=3',
      email: 'user@test.com',
      password: 'strongpassword',
    };
    usersServiceMock.createUser.mockResolvedValue(mockUser);

    const result = await usersController.create(mockUser);

    expect(result).toBe(mockUser);
    expect(usersServiceMock.createUser).toHaveBeenCalledWith(mockUser);
  });

  it('.get() should call UsersService.get()', () => {
    usersController.findAll();
    expect(usersService.findAll).toHaveBeenCalled();
  });

  //?????
  it('.create() should call usersService.createUser()', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      about: 'testuser',
      avatar: 'https://i.pravatar.cc/150?img=3',
      email: 'user@test.com',
      password: 'strongpassword',
    }; // Mock data for CreateUserDto
    const expectedResult: User = {
      username: 'testuser',
      about: 'testuser',
      avatar: 'https://i.pravatar.cc/150?img=3',
      email: 'user@test.com',
      password: 'strongpassword',
    }; // Mock data for User

    usersServiceMock.createUser.mockResolvedValue(expectedResult);

    expect(await usersController.create(createUserDto)).toEqual(expectedResult);
    expect(usersServiceMock.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('.get() should call UsersService.findAll()', async () => {
    const expectedResult: User[] = [
      /* ... */
    ]; // Mock data for User array

    usersServiceMock.findAll.mockResolvedValue(expectedResult);

    expect(await usersController.findAll()).toEqual(expectedResult);
    expect(usersServiceMock.findAll).toHaveBeenCalled();
  });
});
