import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UserDto } from './dtos';
import { User } from './user.schema';
import { Role } from '../auth/role';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    const { username, hash } = dto;
    if (!username) {
      throw new Error('Username is required');
    }

    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const newUser = new User();
    newUser.username = username;
    newUser.hash = hash;
    newUser.active = true;

    const created = await this.userRepository.create(newUser);

    const userDto = new UserDto();
    userDto.username = created.username;
    userDto.active = created.active;
    userDto.roles = created.roles;

    delete userDto.hash;

    return userDto;
  }

  async findByUsername(username: string): Promise<UserDto> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    const userDto = new UserDto();
    userDto.username = existingUser.username;
    userDto.active = existingUser.active;
    userDto.roles = existingUser.roles;

    delete userDto.hash;

    return existingUser;
  }

  async activate(username: string): Promise<UserDto> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    if (existingUser.active) {
      throw new Error('User is already active');
    }

    const user = await this.userRepository.activate(username);

    const userDto = new UserDto();
    userDto.username = user.username;
    userDto.active = user.active;
    userDto.roles = user.roles;

    delete userDto.hash;

    return userDto;
  }

  async deactivate(username: string): Promise<UserDto> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    if (!existingUser.active) {
      throw new Error('User is already inactive');
    }

    const user = await this.userRepository.deactivate(username);
    const userDto = new UserDto();
    userDto.username = user.username;
    userDto.active = user.active;
    userDto.roles = user.roles;

    delete userDto.hash;

    return userDto;
  }

  async updateUsername(
    username: string,
    newUsername: string,
  ): Promise<UserDto> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    const usernameExists = await this.userRepository.findByUsername(newUsername);
    if (usernameExists) {
      throw new Error('Username already occupied by another user');
    }

    const user = await this.userRepository.updateUsername(
      username,
      newUsername,
    );

    const userDto = new UserDto();
    userDto.username = user.username;
    userDto.active = user.active;
    userDto.roles = user.roles;

    delete userDto.hash;

    return userDto;
  }

  async updatePassword(username: string, hash: string): Promise<UserDto> {
    const existingUser = await this.userRepository.findByUsername(username);
    if (!existingUser) {
      throw new Error('User does not exist');
    }

    const user = await this.userRepository.updatePassword(username, hash);
    const userDto = new UserDto();
    userDto.username = user.username;
    userDto.active = user.active;
    userDto.roles = user.roles;

    delete userDto.hash;

    return userDto;
  }

  async exists(username: string) {
    const existing = await this.userRepository.findByUsername(username);
    return !!existing;
  }

  async updateRoles(username: string, roles: Role[]) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error('User does not exist');
    }

    const updated = await this.userRepository.updateRoles(username, roles);
    delete updated.hash;

    return updated;
  }
}
