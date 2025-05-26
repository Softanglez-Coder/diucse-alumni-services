import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';

import { DatabaseModule, StorageModule } from '@core';

import { PaymentModule } from '@payment';
import { MembershipModule } from '@membership';
import { BatchModule } from '@batch';
import { ShiftModule } from '@shift';
import { MediaModule } from '@media';
import { UserModule } from '@user';
import { MemberModule } from '@member';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 10,
        },
      ],
    }),
    DatabaseModule,
    StorageModule,
    MediaModule,
    PaymentModule,
    MembershipModule,
    BatchModule,
    ShiftModule,
    UserModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
