import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserModel = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear un nuevo usuario correctamente', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(mockUserModel, 'save').mockResolvedValue(createUserDto as any);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createUserDto);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockUserModel.save).toHaveBeenCalled();
    });

    it('debería lanzar un BadRequestException si el email es inválido', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'invalidEmail',
        password: 'password123',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar un UnauthorizedException si el email ya existe', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(createUserDto as any);

      await expect(service.create(createUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findOneByEmail', () => {
    it('debería retornar un usuario si existe', async () => {
      const email = 'test@example.com';
      const user = { email, password: 'hashedPassword' };

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(user as any);

      const result = await service.findOneByEmail(email);

      expect(result).toEqual(user);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
    });

    it('debería retornar undefined si el usuario no existe', async () => {
      const email = 'nonexistent@example.com';

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);

      const result = await service.findOneByEmail(email);

      expect(result).toBeUndefined();
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
    });
  });
});
