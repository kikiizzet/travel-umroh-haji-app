import { PartialType } from '@nestjs/mapped-types';
import { CreateGaleriDto } from './create-galeri.dto';

export class UpdateGaleriDto extends PartialType(CreateGaleriDto) { }
