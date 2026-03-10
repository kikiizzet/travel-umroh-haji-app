import { PartialType } from '@nestjs/mapped-types';
import { CreatePaketDto } from './create-paket.dto';

export class UpdatePaketDto extends PartialType(CreatePaketDto) {}
