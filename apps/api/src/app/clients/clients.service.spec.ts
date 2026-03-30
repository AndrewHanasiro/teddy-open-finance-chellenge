import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientsService } from './clients.service';
import { Client } from '../../entities/client.entity';
import { NotFoundException } from '@nestjs/common';
import { randAmount, randEmail, randFullName, randUuid } from '@ngneat/falso';

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: Repository<Client>;

  const mockClient = {
    publicId: randUuid(),
    name: randFullName(),
    email: randEmail(),
    salary: randAmount(),
    valuation: randAmount(),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockClient),
    save: jest.fn().mockResolvedValue(mockClient),
    findAndCount: jest.fn().mockResolvedValue([[mockClient], 1]),
    findOne: jest.fn(),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    softRemove: jest.fn().mockResolvedValue(mockClient),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get<Repository<Client>>(getRepositoryToken(Client));
  });

  describe('create', () => {
    it('should successfully create a client', async () => {
      const dto = {
        name: randFullName(),
        email: randEmail(),
        salary: randAmount(),
        valuation: randAmount(),
      };
      const result = await service.create(dto);
      expect(result).toEqual(mockClient);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const result = await service.findAll({ page: 2, limit: 5 });
      expect(result.page).toBe(2);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        select: ['publicId', 'email', 'name', 'salary', 'valuation'],
        take: 5,
        skip: 5,
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if client does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a client if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockClient);
      expect(await service.findOne('uuid-123')).toEqual(mockClient);
    });
  });

  describe('update', () => {
    it('should update and return the updated client', async () => {
      mockRepository.findOne.mockResolvedValue(mockClient);
      const result = await service.update('uuid-123', mockClient);
      expect(result).toEqual(mockClient);
      expect(repository.update).toHaveBeenCalled();
    });
  });
});
