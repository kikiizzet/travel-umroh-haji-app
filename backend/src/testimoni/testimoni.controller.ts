import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TestimoniService } from './testimoni.service';
import { CreateTestimoniDto } from './dto/create-testimoni.dto';
import { UpdateTestimoniDto } from './dto/update-testimoni.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('testimoni')
export class TestimoniController {
    constructor(private readonly testimoniService: TestimoniService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createTestimoniDto: CreateTestimoniDto) {
        return this.testimoniService.create(createTestimoniDto);
    }

    @Get()
    findAll() {
        return this.testimoniService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.testimoniService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateTestimoniDto: UpdateTestimoniDto) {
        return this.testimoniService.update(+id, updateTestimoniDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.testimoniService.remove(+id);
    }
}
