import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(username: string, password: string) {
    const hashedPassword = await this.hashPassword(password);
    return await this.userRepository.create(username, hashedPassword);
  }

  async findByUsername(username: string) {
    return await this.userRepository.findByUsername(username);
  }

  async findById(id: string) {
    return await this.userRepository.findById(id);
  }

  async updatePassword(id: string, newPassword: string) {
    const hashedPassword = await this.hashPassword(newPassword);
    return await this.userRepository.updatePassword(id, hashedPassword);
  }

  async deleteById(id: string) {
    return await this.userRepository.deleteById(id);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async exists(username: string): Promise<boolean> {
    return await this.userRepository.exists(username);
  }

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return false;
    }

    return await this.comparePasswords(password, user.hash);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
