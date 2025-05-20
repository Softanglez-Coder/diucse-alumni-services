import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  async create(@Body() createCountryDto: CreateCountryDto) {
    return await this.countryService.create(createCountryDto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.countryService.getAll();
  }
}
