import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    return this.userService.validateUser(email, password);
  }

  async login(user: User) {
    const payload: JwtPayload = {
      email: user.email,
      sub: (user as any)._id.toString(),
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn') || '1d',
      }),
    };
  }

  async register(email: string, name: string, password: string) {
    const user = await this.userService.createUser(email, name, password);
    return this.login(user);
  }
}
