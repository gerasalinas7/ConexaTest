import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  login: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería retornar un token de acceso cuando las credenciales son válidas', async () => {
      const loginDto: LoginDTO = { email: 'user@example.com', password: 'password123' };
      const result = { access_token: 'mocked_access_token' };

      mockAuthService.login.mockResolvedValue(result);

      const response = await authController.login(loginDto);
      expect(response).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('debería lanzar UnauthorizedException cuando las credenciales son inválidas', async () => {
      const loginDto: LoginDTO = { email: 'user@example.com', password: 'wrongPassword' };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid email or password'));

      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
