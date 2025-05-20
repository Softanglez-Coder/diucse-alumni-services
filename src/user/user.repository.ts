import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async create(user: User) {
    const created = new this.user(user);
    return await created.save();
  }

  async remove(id: string) {
    return await this.user.deleteOne({ _id: id }).exec();
  }

  async findAll() {
    return await this.user.find().exec();
  }

  async update(id: string, user: User) {
    return await this.user.updateOne({ _id: id }, user).exec();
  }

  async findById(id: string) {
    return await this.user.findById(id).exec();
  }

  async findByAuth0Id(auth0Id: string) {
    return await this.user.findOne({ auth0Id }).exec();
  }
}