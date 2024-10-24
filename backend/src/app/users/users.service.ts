import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.model';
import { CreateUserType, UpdateUserType } from './dto/user.schema';
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
      throw new BadRequestException("Cant Create a User")
    }
  }

  // async list(pagination?: PaginatedRequestType): Promise<{
  //   data: User[];
  //   meta: Meta;
  // }> {
  //   return this.userModel.find().exec();
  // }


  // async update(
  //   id: number,
  //   updateUserDto: UpdateUserType
  // ): Promise<{ data: { user: User } } | null> {}

}
