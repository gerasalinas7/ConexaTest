import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

describe('User Schema', () => {
  let userModel: Model<UserDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: Model, // Simulando el modelo de Mongoose
        },
      ],
    }).compile();

    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(userModel).toBeDefined();
  });

  it('should create a user', async () => {
    const userData = {
      email: 'user@example.com',
      password: 'strongpassword123',
      role: 'regular',
    };

    const user = new userModel(userData);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
    expect(user.role).toBe(userData.role);
  });

  it('should throw an error if email is missing', async () => {
    const userData = {
      password: 'strongpassword123',
      role: 'regular',
    };

    const user = new userModel(userData);
    await expect(user.validate()).rejects.toThrow();
  });

  it('should throw an error if password is missing', async () => {
    const userData = {
      email: 'user@example.com',
      role: 'regular',
    };

    const user = new userModel(userData);
    await expect(user.validate()).rejects.toThrow();
  });

  it('should throw an error if email is not unique', async () => {
    const existingUserData = {
      email: 'existinguser@example.com',
      password: 'strongpassword123',
      role: 'regular',
    };

    const existingUser = new userModel(existingUserData);
    await existingUser.save(); // Guarda el primer documento

    const duplicateUserData = {
      email: 'existinguser@example.com', // Email duplicado
      password: 'anotherpassword456',
      role: 'admin',
    };

    const duplicateUser = new userModel(duplicateUserData);
    await expect(duplicateUser.save()).rejects.toThrow();
  });
});
