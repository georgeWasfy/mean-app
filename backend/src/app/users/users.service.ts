import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.model';
import { CreateUserType } from './dto/user.schema';
import { Meta, PaginatedRequestType } from '../schema/helpers.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(
    createUserDto: CreateUserType
  ): Promise<{ data: { user: User } }> {
    try {
      const createdUser = new this.userModel(createUserDto);
      // Save newUser object to database
      const doc = await createdUser.save();
      return {
        data: { user: doc },
      };
    } catch (error) {
      throw new BadRequestException('Cant Create a User');
    }
  }

  async list(pagination?: PaginatedRequestType): Promise<{
    data: User[];
    meta: Meta;
  }> {
    let limit = 10;
    let offset = 0;
    if (pagination) {
      limit = pagination?.per_page;
      offset = (pagination.page - 1) * pagination.per_page;
    }
    try {
      const docCount = await this.userModel.collection.countDocuments();

      const users = await this.userModel.find().skip(offset).limit(limit);
      return {
        meta: {
          total: docCount,
          current_page: offset,
          per_page: limit,
        },
        data: users,
      };
    } catch (error) {
      throw new BadRequestException('Unable to Fetch Users');
    }
  }
}
