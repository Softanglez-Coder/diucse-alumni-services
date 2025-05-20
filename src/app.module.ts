import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { GalleryModule } from './gallery/gallery.module';
import { NoticeModule } from './notice/notice.module';
import { CommitteeModule } from './committee/committee.module';
import { NewsModule } from './news/news.module';
import { MemberModule } from './member/member.module';
import { MembershipModule } from './membership/membership.module';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { StorageModule } from './storage/storage.module';
import { MediaModule } from './media/media.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    EventModule,
    GalleryModule,
    NoticeModule,
    CommitteeModule,
    NewsModule,
    MemberModule,
    MembershipModule,
    BlogModule,
    UserModule,
    PaymentModule,
    StorageModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
