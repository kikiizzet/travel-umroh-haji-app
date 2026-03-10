import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTestimoniDto } from './dto/create-testimoni.dto';
import { UpdateTestimoniDto } from './dto/update-testimoni.dto';

@Injectable()
export class TestimoniService {
    constructor(private prisma: PrismaService) { }

    async create(createTestimoniDto: CreateTestimoniDto) {
        return this.prisma.testimoni.create({
            data: createTestimoniDto,
        });
    }

    async findAll() {
        return this.prisma.testimoni.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        const testimoni = await this.prisma.testimoni.findUnique({
            where: { id },
        });
        if (!testimoni) throw new NotFoundException(`Testimoni with ID ${id} not found`);
        return testimoni;
    }

    async update(id: number, updateTestimoniDto: UpdateTestimoniDto) {
        return this.prisma.testimoni.update({
            where: { id },
            data: updateTestimoniDto,
        });
    }

    async remove(id: number) {
        return this.prisma.testimoni.delete({
            where: { id },
        });
    }
}
