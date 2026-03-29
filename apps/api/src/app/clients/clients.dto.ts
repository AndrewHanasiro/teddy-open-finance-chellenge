import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class ClientDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  salary!: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  valuation!: number;
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}