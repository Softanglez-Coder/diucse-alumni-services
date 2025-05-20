import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
  Request,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUsernameDto, ChangePasswordDto } from './dtos';
import { AuthGuard } from '../auth/guards/auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':username/activate')
  async activate(@Param('username') username: string) {
    return await this.userService.activate(username);
  }

  @Patch(':username/deactivate')
  async deactivate(@Param('username') username: string) {
    return await this.userService.deactivate(username);
  }

  @Patch(':username/update/username')
  async updateUsername(
    @Param('username') username: string,
    @Body() body: UpdateUsernameDto,
  ) {
    return await this.userService.updateUsername(username, body.username);
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req: { user: any },
    @Body() body: ChangePasswordDto,
  ) {
    const username = req.user.sub;
    const user = await this.userService.findByUsername(username);
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(body.currentPassword, user.hash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    
    // Hash new password and update
    const newHash = await bcrypt.hash(body.newPassword, 10);
    return await this.userService.updatePassword(username, newHash);
  }
}
