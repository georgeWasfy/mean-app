import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInType, SignUpType, Tokens } from './dto/auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/models/user.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}
  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async generateTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('TOKEN.ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('TOKEN.ACCESS_TOKEN_EXPIRY'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('TOKEN.REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('TOKEN.REFRESH_TOKEN_EXPIRY'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await this.hashPassword(rt);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        hashedRt: hash,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  async localSignUp(signupDto: SignUpType): Promise<Tokens> {
    try {
      const hashedPassword = await this.hashPassword(signupDto.password);
      signupDto.password = hashedPassword;
      const createdUser = await this.userService.create(signupDto);

      const tokens = await this.generateTokens(
        createdUser.data.user._id.toString(),
        createdUser.data.user.email
      );
      await this.updateRtHash(createdUser.data.user._id.toString(), tokens.refresh_token);
      return tokens;
    } catch (error) {
      throw new BadRequestException('Unable to create User');
    }
  }

  async localSignIn(signinDto: SignInType) {
    let tokens = { access_token: '', refresh_token: '' };
    try {
      const userByEmail = await this.userModel
        .findOne({ email: signinDto.email })
        .exec();

      if (userByEmail) {
        const matchPasswords = await bcrypt.compare(
          signinDto.password,
          userByEmail.password
        );
        if (!matchPasswords) throw new ForbiddenException('Access Denied');

        tokens = await this.generateTokens(userByEmail.id.toString(), signinDto.email);
        await this.updateRtHash(userByEmail.id.toString(), tokens.refresh_token);
      } else {
        throw new ForbiddenException('Access Denied');
      }
      return { ...tokens, ...userByEmail };
    } catch (err) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async localLogOut(userId: string) {
    await this.userModel.findByIdAndUpdate(
      userId,
      {
        hashedRt: null,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async refreshTokens(userId: string, refresh_token: string): Promise<Tokens> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');
    const matchTokens = await bcrypt.compare(refresh_token, user.hashedRt!);
    if (!matchTokens) throw new ForbiddenException('Access Denied');
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
