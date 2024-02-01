import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  const usersServiceMock = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('.create() should call usersService.create()', async () => {
    const mockUser = {
      username: 'testuser',
      about: 'testuser',
      avatar: 'https://i.pravatar.cc/150?img=3',
      email: 'user@test.com',
      password: 'strongpassword',
    };
    usersService.createUser = jest.fn().mockResolvedValue(mockUser);

    await expect(usersController.create(mockUser)).resolves.toBe(mockUser);
    expect(usersService.createUser).toHaveBeenCalledWith(mockUser);
  });

  it('.get() should call UsersService.get()', () => {
    usersController.findAll();
    expect(usersService.findAll).toHaveBeenCalled();
  });
});
