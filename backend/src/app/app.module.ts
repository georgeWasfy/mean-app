import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import tokenConfig from './config/token.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [tokenConfig],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/project', {}),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}