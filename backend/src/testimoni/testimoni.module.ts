import { Module } from '@nestjs/common';
import { TestimoniService } from './testimoni.service';
import { TestimoniController } from './testimoni.controller';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [TestimoniController],
    providers: [TestimoniService, PrismaService],
})
export class TestimoniModule { }
