import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { randEmail, randFullName, randPassword } from '@ngneat/falso';
import { JwtStrategy } from './jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';

describe('AppController', () => {
  let app: TestingModule;
  const payloadR = {
    email: randEmail(),
    password: randPassword(),
    name: randFullName(),
  } satisfies RegisterDto;

  beforeAll(async () => {
    const mockLoginResponse = {
      access_token: 'mock_token',
      user: mockUser,
    };

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
          provide: 'JwtService',
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
            verify: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockImplementation((user) =>
              Promise.resolve({
                ...user,
                id: '1',
                publicId: 'uuid',
                created_at: new Date(),
              }),
            ),
            findOne: jest.fn().mockImplementation((user) =>
              Promise.resolve({
                ...user,
                id: '1',
                publicId: 'uuid',
                created_at: new Date(),
              }),
            ),
          },
        },
      ],
    }).compile();
  });

  describe('endpoints /auth', () => {
    it('/register', () => {
      const appController = app.get<AuthController>(AuthController);
      expect(appController.register(payloadR)).toEqual({
        id: expect.any(String),
        publicId: expect.any(String),
        name: payloadR.name,
        email: payloadR.email,
        created_at: expect.any(Date),
      });
    });

    it('/login', async () => {
      const appController = app.get<AuthController>(AuthController);
      await appController.register(payloadR);

      const payloadL = {
        email: payloadR.email,
        password: payloadR.password,
      } satisfies LoginDto;

      expect(appController.login(payloadL)).toEqual({
        access_token: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          email: payloadR.email,
          name: payloadR.name,
        }),
      });
    });
  });
});
