import { Module } from '@nestjs/common';
import { PaketService } from './paket.service';
import { PaketController } from './paket.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PaketController],
  providers: [PaketService, PrismaService],
})
export class PaketModule {}
