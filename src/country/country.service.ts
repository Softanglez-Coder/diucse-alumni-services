import { BadRequestException, Injectable } from '@nestjs/common';
import { CountryRepository } from './country.repository';
import { Country } from './country.schema';
import { CreateCountryDto } from './dto/create-country.dto';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async getAll(): Promise<CreateCountryDto[]> {
    return await this.countryRepository.findAll();
  }

  async create(dto: CreateCountryDto): Promise<CreateCountryDto> {
    const existingCountry = await this.countryRepository.findByProperty(
      'name',
      dto.name,
    );

    if (existingCountry) {
      throw new BadRequestException('Country name already exists');
    }

    const existingCode = await this.countryRepository.findByProperty(
      'code',
      dto.code,
    );
    if (existingCode) {
      throw new BadRequestException('Country code already exists');
    }

    const country = new Country();
    country.name = dto.name;
    country.code = dto.code;

    const created = await this.countryRepository.create(country);
    return created;
  }
}
