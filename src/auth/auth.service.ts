import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dtos';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenRepository } from './refresh-token.repository';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    // Run cleanup for expired tokens periodically
    setInterval(() => {
      this.refreshTokenRepository.deleteExpired().catch(error => {
        console.error('Error cleaning up expired tokens:', error);
      });
    }, 24 * 60 * 60 * 1000); // Once a day
  }

  async register(dto: RegisterDto) {
    const exists = await this.userService.exists(dto.username);
    if (exists) {
      throw new Error('Username already exists. Try with new username.');
    }

    const hash = await bcrypt.hash(dto.password, 10); // 10 = salt rounds

    const user: CreateUserDto = {
      username: dto.username,
      hash,
    };

    const registered = await this.userService.create(user);
    return registered;
  }

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
      });
    }

    if (!user.active) {
      throw new ForbiddenException({
        message: 'Account is deactivated. Please contact support.',
      });
    }

    const valid = await bcrypt.compare(password, user.hash);
    if (!valid) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
      });
    }

    return await this.generateTokens(username);
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify the refresh token format and signature
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      // Check if the token exists in the database and is not revoked
      const storedToken = await this.refreshTokenRepository.findByToken(refreshToken);
      if (!storedToken) {
        throw new ForbiddenException('Invalid refresh token');
      }

      // Verify the token belongs to the right user
      if (payload.sub !== storedToken.username) {
        throw new ForbiddenException('Token does not match user');
      }

      // Revoke the old refresh token
      await this.refreshTokenRepository.revokeToken(refreshToken);

      // Generate new tokens
      return await this.generateTokens(payload.sub);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(username: string) {
    await this.refreshTokenRepository.revokeByUsername(username);
    return { message: 'Logout successful' };
  }

  private async generateTokens(username: string) {
    const payload = { sub: username };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m', // 15 minutes
    });

    const refreshTokenPayload = { sub: username };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d', // 7 days
    });

    // Calculate expiration date for the refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Store the refresh token in the database
    await this.refreshTokenRepository.create(refreshToken, username, expiresAt);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }
}
