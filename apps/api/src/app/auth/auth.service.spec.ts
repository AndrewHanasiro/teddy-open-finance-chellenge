import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUser = {
    id: 'uuid-123',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return an access token and user info on success', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        access_token: 'mock_token',
        user: { id: mockUser.id, name: mockUser.name, email: mockUser.email },
      });
      expect(jwtService.signAsync).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create and return a new user if email is unique', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashedPassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser as User);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser as User);

      const result = await service.register(
        'new@example.com',
        'pass123',
        'New User',
      );

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw ConflictException if user already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      await expect(
        service.register('test@example.com', 'pass123', 'Name'),
      ).rejects.toThrow(ConflictException);
    });
  });
});
