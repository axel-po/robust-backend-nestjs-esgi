import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MentorsModule } from './mentors/mentors.module';
import { RequestsModule } from './requests/requests.module';
import { SessionsModule } from './sessions/sessions.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    MentorsModule,
    RequestsModule,
    SessionsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
