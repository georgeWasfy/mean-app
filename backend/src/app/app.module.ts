import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import tokenConfig from './config/token.config';
import { env } from './utils/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [tokenConfig],
    }),
    MongooseModule.forRoot(env('DB'), {}),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}