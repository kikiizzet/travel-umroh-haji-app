import { Module } from '@nestjs/common';
import { GaleriService } from './galeri.service';
import { GaleriController } from './galeri.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [GaleriController],
    providers: [GaleriService, PrismaService],
})
export class GaleriModule { }
