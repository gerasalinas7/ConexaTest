import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

const mockUsersService = {
  findOneByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('debería validar al usuario y retornar sus datos sin la contraseña', async () => {
      const email = 'user@example.com';
      const password = 'password123';
      const user = {
        email,
        password: await bcrypt.hash(password, 10),
        _id: '123456',
        role: 'regular',
      };

      mockUsersService.findOneByEmail.mockResolvedValue(user);

      const result = await authService.validateUser(email, password);
      expect(result).toEqual({ email: user.email, _id: user._id, role: user.role });
    });

    it('debería retornar null si el usuario no existe', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      
      const result = await authService.validateUser('unknown@example.com', 'password123');
      expect(result).toBeNull();
    });

    it('debería retornar null si la contraseña es incorrecta', async () => {
      const email = 'user@example.com';
      const user = {
        email,
        password: await bcrypt.hash('correctPassword', 10),
        _id: '123456',
        role: 'regular',
      };

      mockUsersService.findOneByEmail.mockResolvedValue(user);

      const result = await authService.validateUser(email, 'wrongPassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('debería lanzar UnauthorizedException si las credenciales son inválidas', async () => {
      const loginDto: LoginDTO = { email: 'user@example.com', password: 'wrongPassword' };

      mockUsersService.findOneByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('debería retornar un token de acceso si las credenciales son válidas', async () => {
      const loginDto: LoginDTO = { email: 'user@example.com', password: 'password123' };
      const user = {
        email: loginDto.email,
        password: await bcrypt.hash(loginDto.password, 10),
        _id: '123456',
        role: 'regular',
      };

      mockUsersService.findOneByEmail.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('mocked_access_token');

      const result = await authService.login(loginDto);
      expect(result).toEqual({ access_token: 'mocked_access_token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user._id,
        role: user.role,
      });
    });
  });
});
