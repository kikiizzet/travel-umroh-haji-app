import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateTestimoniDto {
    @IsString()
    nama: string;

    @IsString()
    peran: string;

    @IsString()
    pesan: string;

    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    rating?: number;

    @IsString()
    @IsOptional()
    gambarUrl?: string;
}
