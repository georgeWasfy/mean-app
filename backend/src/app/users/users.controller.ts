import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserQuerySchema,
  UserQueryType,
} from './dto/user.schema';
import { ValidationPipe } from '../pipes/validation.pipe';
import { TransformationPipe } from '../pipes/transformation.pipe';

@Controller({ version: '1', path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query(new TransformationPipe(), new ValidationPipe(UserQuerySchema))
    query: UserQueryType
  ) {
    return await this.usersService.list(query.paging);
  }
}
