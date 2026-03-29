import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entities/client.entity';
import { ClientDto, PaginationDto } from './clients.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: ClientDto) {
    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const [data, total] = await this.clientRepository.findAndCount({
      select: ['publicId', 'email', 'name', 'salary', 'valuation'],
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(publicId: string) {
    const client = await this.clientRepository.findOne({ where: { publicId } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(publicId: string, updateClientDto: ClientDto) {
    await this.findOne(publicId);
    await this.clientRepository.update({ publicId }, updateClientDto);
    return this.findOne(publicId);
  }

  async remove(publicId: string) {
    const client = await this.findOne(publicId);
    return await this.clientRepository.softRemove(client);
  }
}
