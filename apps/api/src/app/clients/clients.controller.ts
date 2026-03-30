import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientDto, PaginationDto } from './clients.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
@UseGuards(JwtAuthGuard)
@Controller('clients')
@UseInterceptors(CacheInterceptor)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: ClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @CacheKey('all_users')
  @CacheTTL(600)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.clientsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClientDto: ClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
