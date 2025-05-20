import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { Role } from '../auth/role';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}
  
  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async findByUsername(username: string): Promise<User> {
    const existing = await this.userModel.findOne({ username });
    return existing;
  }

  async updateUsername(username: string, newUsername: string): Promise<User> {
    const user = await this.findByUsername(username);
    user.username = newUsername;
    return await user.save();
  }

  async updatePassword(username: string, hash: string): Promise<User> {
    const user = await this.findByUsername(username);
    user.hash = hash;
    return await user.save();
  }

  async activate(username: string): Promise<User> {
    const user = await this.findByUsername(username);
    user.active = true;
    return await user.save();
  }

  async deactivate(username: string): Promise<User> {
    const user = await this.findByUsername(username);
    user.active = false;
    return await user.save();
  }

  async updateRoles(username: string, roles: Role[]): Promise<User> {
    const user = await this.findByUsername(username);
    user.roles = roles;
    return await user.save();
  }
}
