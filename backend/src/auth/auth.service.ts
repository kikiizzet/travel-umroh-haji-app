import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    console.log(`🔑 Mencoba login untuk email: ${dto.email}`);
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const passwordMatch = await bcrypt.compare(dto.password, admin.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { sub: admin.id, email: admin.email, nama: admin.nama };
    return {
      access_token: this.jwtService.sign(payload),
      admin: { id: admin.id, email: admin.email, nama: admin.nama },
    };
  }

  // Helper untuk seed admin pertama kali
  async createAdmin(email: string, password: string, nama: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.admin.create({
      data: { email, password: hashed, nama },
    });
  }
}
