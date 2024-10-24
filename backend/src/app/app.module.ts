import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot('mongodb://localhost:27017/your_database_name', {}),
    UserModule
  ],
})
export class AppModule {}