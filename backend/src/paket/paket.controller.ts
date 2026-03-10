import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PaketService } from './paket.service';
import { CreatePaketDto } from './dto/create-paket.dto';
import { UpdatePaketDto } from './dto/update-paket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('paket')
export class PaketController {
  constructor(private readonly paketService: PaketService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPaketDto: CreatePaketDto) {
    return this.paketService.create(createPaketDto);
  }

  @Get()
  findAll(
    @Query('jenis') jenis?: string,
    @Query('month') month?: string,
    @Query('nama') nama?: string,
  ) {
    return this.paketService.findAll(jenis, month, nama);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paketService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePaketDto: UpdatePaketDto) {
    return this.paketService.update(+id, updatePaketDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.paketService.remove(+id);
  }
}
