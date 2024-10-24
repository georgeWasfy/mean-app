import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserSchema,
  CreateUserType,
  UpdateUserSchema,
  UpdateUserType,
  UserQuerySchema,
  UserQueryType,
} from './dto/user.schema';
import { ValidationPipe } from '../pipes/validation.pipe';
import { TransformationPipe } from '../pipes/transformation.pipe';

@Controller({ version: '1', path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe(CreateUserSchema))
  async create(@Body() createUserDto: CreateUserType) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query(new TransformationPipe(), new ValidationPipe(UserQuerySchema))
    query: UserQueryType,
  ) {
    // return await this.usersService.list(query.paging);
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe(UpdateUserSchema)) updateUserDto: UpdateUserType,
  ) {
    // return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // return await this.usersService.remove(+id);
  }

}
