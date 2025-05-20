import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateUserDto) {
    const user = new User();
    user.auth0Id = dto.auth0Id;
    user.name = dto.name;
    user.email = dto.email;
    user.picture = dto.picture;

    const created = await this.userRepository.create(user);

    if (!created) {
      return null;
    }

    const userDto = new UserDto();
    userDto.id = created.id;
    userDto.name = created.name;
    userDto.email = created.email;
    userDto.picture = created.picture;

    return user;
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: string) {
    return await this.userRepository.findById(id);
  }

  async update(id: string, dto: UpdateUserDto) {
    const userDocument = await this.userRepository.findById(id);

    if (!userDocument) {
      return null;
    }

    userDocument.name = dto.name;
    userDocument.email = dto.email;
    userDocument.picture = dto.picture;

    const updated = await this.userRepository.update(id, userDocument);

    if (!updated) {
      return null;
    }

    const user = new UserDto();
    user.id = id;
    user.auth0Id = userDocument.auth0Id;
    user.name = userDocument.name;
    user.email = userDocument.email;
    user.picture = userDocument.picture;

    return user;
  }

  async remove(id: string) {
    return await this.userRepository.remove(id);
  }

  async findByAuth0Id(auth0Id: string) {
    const userDocument = await this.userRepository.findByAuth0Id(auth0Id);

    if (!userDocument) {
      return null;
    }

    const user = new UserDto();
    user.id = userDocument.id;
    user.auth0Id = userDocument.auth0Id;
    user.name = userDocument.name;
    user.email = userDocument.email;
    user.picture = userDocument.picture;

    return user;
  }
}
