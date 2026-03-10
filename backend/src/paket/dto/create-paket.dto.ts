import { IsString, IsInt, IsOptional, IsArray, IsBoolean, IsDateString, Min } from 'class-validator';

export class CreatePaketDto {
  @IsString()
  nama: string;

  @IsString()
  jenis: string;

  @IsInt()
  @Min(0)
  harga: number;

  @IsString()
  deskripsi: string;

  @IsDateString()
  tanggalBerangkat: string;

  @IsInt()
  @Min(1)
  durasi: number;

  @IsString()
  maskapai: string;

  @IsString()
  rute: string;

  @IsInt()
  @Min(1)
  kuotaTotal: number;

  @IsOptional()
  @IsString()
  gambarUrl?: string;

  @IsArray()
  @IsString({ each: true })
  fasilitas: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
