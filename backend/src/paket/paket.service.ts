import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePaketDto } from './dto/create-paket.dto';
import { UpdatePaketDto } from './dto/update-paket.dto';

@Injectable()
export class PaketService {
  constructor(private prisma: PrismaService) {}

  async create(createPaketDto: CreatePaketDto) {
    return this.prisma.paket.create({
      data: {
        ...createPaketDto,
        tanggalBerangkat: new Date(createPaketDto.tanggalBerangkat),
      },
    });
  }

  async findAll(jenis?: string, month?: string, nama?: string) {
    const where: any = { isActive: true };
    
    if (jenis) {
      where.jenis = jenis;
    }

    if (nama) {
      where.nama = {
        contains: nama,
        mode: 'insensitive',
      };
    }

    if (month) {
      const year = new Date().getFullYear();
      const startDate = new Date(year, parseInt(month) - 1, 1);
      const endDate = new Date(year, parseInt(month), 0);
      where.tanggalBerangkat = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.paket.findMany({
      where,
      orderBy: { tanggalBerangkat: 'asc' },
    });
  }

  async findOne(id: number) {
    const paket = await this.prisma.paket.findUnique({
      where: { id },
    });
    if (!paket) throw new NotFoundException(`Paket with ID ${id} not found`);
    return paket;
  }

  async update(id: number, updatePaketDto: UpdatePaketDto) {
    const data = { ...updatePaketDto };
    if (data.tanggalBerangkat) {
      data.tanggalBerangkat = new Date(data.tanggalBerangkat) as any;
    }
    
    return this.prisma.paket.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.paket.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
