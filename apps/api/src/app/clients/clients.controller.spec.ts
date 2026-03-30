import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientDto, PaginationDto } from './clients.dto';
import { randEmail, randFullName, randAmount, randUuid } from '@ngneat/falso';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  const mockClient = {
    publicId: randUuid(),
    name: randFullName(),
    email: randEmail(),
    salary: randAmount() * 100,
    valuation: randAmount() * 1000,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockClient),
    findAll: jest.fn().mockResolvedValue({ data: [mockClient], total: 1 }),
    findOne: jest.fn().mockResolvedValue(mockClient),
    update: jest.fn().mockResolvedValue(mockClient),
    remove: jest
      .fn()
      .mockResolvedValue({ ...mockClient, deletedAt: new Date() }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a client', async () => {
    const dto: ClientDto = {
      name: randFullName(),
      email: randEmail(),
      salary: randAmount() * 100,
      valuation: randAmount() * 1000,
    };
    expect(await controller.create(dto)).toEqual(mockClient);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return paginated clients', async () => {
    const dto: PaginationDto = { page: 1, limit: 10 };
    expect(await controller.findAll(dto)).toEqual({
      data: [mockClient],
      total: 1,
    });
    expect(service.findAll).toHaveBeenCalledWith(dto);
  });

  it('should return a single client', async () => {
    const uuid = randUuid();
    expect(await controller.findOne(uuid)).toEqual(mockClient);
    expect(service.findOne).toHaveBeenCalledWith(uuid);
  });

  it('should update a client', async () => {
    const dto: ClientDto = {
      name: randFullName(),
      email: randEmail(),
      salary: randAmount() * 100,
      valuation: randAmount() * 1000,
    };
    const uuid = randUuid();
    expect(await controller.update(uuid, dto)).toEqual(mockClient);
    expect(service.update).toHaveBeenCalledWith(uuid, dto);
  });

  it('should remove a client', async () => {
    const uuid = randUuid();
    expect(await controller.remove(uuid)).toBeDefined();
    expect(service.remove).toHaveBeenCalledWith(uuid);
  });
});
