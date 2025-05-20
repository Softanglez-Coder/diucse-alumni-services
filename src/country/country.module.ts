import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './country.schema';
import { CountryRepository } from './country.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Country.name,
        schema: CountrySchema,
      }
    ])
  ],
  controllers: [CountryController],
  providers: [
    CountryService,
    CountryRepository
  ],
})
export class CountryModule {}
