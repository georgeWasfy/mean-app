import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';
import { AccessTokenStrategy } from './strategies/access-token-strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import UserSchema, { User } from '../users/models/user.model';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
