import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Country, CountryDocument } from './country.schema';
import { Model } from 'mongoose';
import { BaseRepository } from '../core';

@Injectable()
export class CountryRepository extends BaseRepository<CountryDocument> {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
  ) {
    super(countryModel);
  }
}
