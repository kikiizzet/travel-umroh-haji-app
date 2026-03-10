import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGaleriDto } from './dto/create-galeri.dto';
import { UpdateGaleriDto } from './dto/update-galeri.dto';

@Injectable()
export class GaleriService {
    constructor(private prisma: PrismaService) { }

    async create(createGaleriDto: CreateGaleriDto) {
        return this.prisma.galeri.create({
            data: createGaleriDto,
        });
    }

    async findAll() {
        return this.prisma.galeri.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        const galeri = await this.prisma.galeri.findUnique({
            where: { id },
        });
        if (!galeri) throw new NotFoundException(`Galeri with ID ${id} not found`);
        return galeri;
    }

    async update(id: number, updateGaleriDto: UpdateGaleriDto) {
        return this.prisma.galeri.update({
            where: { id },
            data: updateGaleriDto,
        });
    }

    async remove(id: number) {
        return this.prisma.galeri.delete({
            where: { id },
        });
    }
}
