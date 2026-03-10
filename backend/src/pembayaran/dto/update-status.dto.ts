import { IsEnum, IsInt } from 'class-validator';
import { StatusPembayaran } from '@prisma/client';

export class UpdatePembayaranStatusDto {
  @IsEnum(StatusPembayaran)
  status: StatusPembayaran;
}
