import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { randEmail, randFullName, randPassword, randUuid } from '@ngneat/falso';
import { JwtStrategy } from './jwt.strategy';

describe('AuthController', () => {
  let app: TestingModule;
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: randUuid(),
    email: randEmail(),
    password: randPassword(),
    name: randFullName(),
  };

  const mockLoginResponse = {
    access_token: 'mock_token',
    user: mockUser,
  };
  beforeAll(async () => {
    // Mock implementation of AuthService
    const mockAuthService = {
      login: jest.fn().mockResolvedValue(mockLoginResponse),
      register: jest.fn().mockResolvedValue(mockUser),
    };
    app = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();
    controller = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('endpoints /auth', () => {
    it('/login', async () => {
      const loginDto: LoginDto = {
        email: randEmail(),
        password: randPassword(),
      };

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith({
        email: loginDto.email,
        password: loginDto.password,
      });
      expect(result).toEqual(mockLoginResponse);
    });

    it('/register', async () => {
      const registerDto: RegisterDto = {
        email: randEmail(),
        password: randPassword(),
        name: randFullName(),
      };

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
      expect(result).toEqual(mockUser);
    });
  });
});
