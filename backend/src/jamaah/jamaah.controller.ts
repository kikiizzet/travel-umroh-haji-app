import { Controller, Post, Body } from '@nestjs/common';
import { JamaahService } from './jamaah.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('jamaah')
export class JamaahController {
  constructor(private readonly jamaahService: JamaahService) {}

  @Post('booking')
  createBooking(@Body() dto: CreateBookingDto) {
    return this.jamaahService.createBooking(dto);
  }
}
