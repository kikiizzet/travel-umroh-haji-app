import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class JamaahService {
  constructor(private prisma: PrismaService) {}

  async createBooking(dto: CreateBookingDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Cek paket
      const paket = await tx.paket.findUnique({
        where: { id: dto.paketId },
      });

      if (!paket) {
        throw new BadRequestException('Paket tidak ditemukan');
      }

      if (paket.kuotaTerisi >= paket.kuotaTotal) {
        throw new BadRequestException('Kuota paket sudah penuh');
      }

      // 2. Buat atau update Jamaah (berdasarkan email)
      const jamaah = await tx.jamaah.upsert({
        where: { email: dto.email },
        update: {
          nama: dto.nama,
          noHp: dto.noHp,
          paketId: dto.paketId,
        },
        create: {
          nama: dto.nama,
          email: dto.email,
          noHp: dto.noHp,
          paketId: dto.paketId,
        },
      });

      // 3. Buat Pembayaran PENDING
      const pembayaran = await tx.pembayaran.create({
        data: {
          jamaahId: jamaah.id,
          jumlah: paket.harga,
          status: 'PENDING',
        },
        include: {
          jamaah: {
            include: { paket: true }
          }
        }
      });

      return pembayaran;
    });
  }
}
