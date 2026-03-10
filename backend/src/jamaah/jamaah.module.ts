import { Module } from '@nestjs/common';
import { JamaahService } from './jamaah.service';
import { JamaahController } from './jamaah.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [JamaahController],
  providers: [JamaahService, PrismaService],
})
export class JamaahModule {}
