import { Module } from '@nestjs/common';
import { PembayaranService } from './pembayaran.service';
import { PembayaranController } from './pembayaran.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PembayaranController],
  providers: [PembayaranService, PrismaService],
})
export class PembayaranModule {}
