import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StatusPembayaran } from '@prisma/client';

@Injectable()
export class PembayaranService {
  constructor(private prisma: PrismaService) {}

  async updateStatus(id: number, status: StatusPembayaran) {
    return this.prisma.$transaction(async (tx) => {
      const pembayaran = await tx.pembayaran.findUnique({
        where: { id },
        include: { jamaah: true },
      });

      if (!pembayaran) throw new NotFoundException('Pembayaran tidak ditemukan');

      // Jika status lama LUNAS dan diubah ke lain, kita kurangi kuota terisi
      // Jika status baru LUNAS, kita tambah kuota terisi
      
      const oldStatus = pembayaran.status;
      
      if (oldStatus === status) return pembayaran;

      if (status === StatusPembayaran.LUNAS) {
        const paket = await tx.paket.findUnique({
          where: { id: pembayaran.jamaah.paketId },
        });

        if (paket.kuotaTerisi >= paket.kuotaTotal) {
          throw new BadRequestException('Kuota seat sudah penuh');
        }

        await tx.paket.update({
          where: { id: paket.id },
          data: { kuotaTerisi: { increment: 1 } },
        });
      } else if (oldStatus === StatusPembayaran.LUNAS) {
        // Jika sebelumnya lunas lalu dibatalkan/pending, kembalikan kuota
        await tx.paket.update({
          where: { id: pembayaran.jamaah.paketId },
          data: { kuotaTerisi: { decrement: 1 } },
        });
      }

      return tx.pembayaran.update({
        where: { id },
        data: { status },
      });
    });
  }

  async findAll() {
    return this.prisma.pembayaran.findMany({
      include: {
        jamaah: {
          include: { paket: true }
        }
      },
      orderBy: { tanggal: 'desc' },
    });
  }
}
