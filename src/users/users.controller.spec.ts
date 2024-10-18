import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';

const mockUsersService = {
  create: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear un nuevo usuario y retornar el usuario creado', async () => {
      const createUserDto: CreateUserDto = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      const result = {
        id: '123456',
        ...createUserDto,
        createdAt: new Date().toISOString(),
      };

      mockUsersService.create.mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toEqual(result);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('debería lanzar un BadRequestException si hay un error en la creación', async () => {
      const createUserDto: CreateUserDto = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      mockUsersService.create.mockRejectedValue(new BadRequestException('Invalid input data'));

      await expect(controller.create(createUserDto)).rejects.toThrow(BadRequestException);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
