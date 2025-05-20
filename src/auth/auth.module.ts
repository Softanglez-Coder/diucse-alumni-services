import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { Auth0Strategy } from './strategies/auth0.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'auth0',
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Auth0Strategy,
  ],
})
export class AuthModule {}
