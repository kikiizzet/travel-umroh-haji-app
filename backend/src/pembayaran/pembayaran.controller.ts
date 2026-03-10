import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { PembayaranService } from './pembayaran.service';
import { UpdatePembayaranStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pembayaran')
@UseGuards(JwtAuthGuard)
export class PembayaranController {
  constructor(private readonly pembayaranService: PembayaranService) {}

  @Get()
  findAll() {
    return this.pembayaranService.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePembayaranStatusDto,
  ) {
    return this.pembayaranService.updateStatus(+id, dto.status);
  }
}
