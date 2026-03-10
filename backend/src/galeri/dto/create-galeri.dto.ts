import { IsString, IsOptional } from 'class-validator';

export class CreateGaleriDto {
    @IsString()
    judul: string;

    @IsString()
    @IsOptional()
    deskripsi?: string;

    @IsString()
    gambarUrl: string;

    @IsString()
    @IsOptional()
    kategori?: string;
}
