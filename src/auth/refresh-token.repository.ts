import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from './refresh-token.schema';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>
  ) {}

  async create(token: string, username: string, expiresAt: Date): Promise<RefreshToken> {
    const refreshToken = new this.refreshTokenModel({
      token,
      username,
      expiresAt,
    });
    return await refreshToken.save();
  }

  async findByToken(token: string): Promise<RefreshToken> {
    return await this.refreshTokenModel.findOne({ token, revoked: false });
  }

  async revokeByUsername(username: string): Promise<void> {
    const now = new Date();
    await this.refreshTokenModel.updateMany(
      { username, revoked: false },
      { revoked: true, revokedAt: now }
    );
  }

  async revokeToken(token: string): Promise<void> {
    const now = new Date();
    await this.refreshTokenModel.updateOne(
      { token, revoked: false },
      { revoked: true, revokedAt: now }
    );
  }

  async deleteExpired(): Promise<void> {
    const now = new Date();
    await this.refreshTokenModel.deleteMany({
      $or: [
        { expiresAt: { $lt: now } },
        { revoked: true, revokedAt: { $lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } }
      ]
    });
  }
}
