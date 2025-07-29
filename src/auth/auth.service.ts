import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDTO } from 'src/user/dto/auth.register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  createToken(user: UserEntity) {
    try {
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.JWTService.sign(payload);
      return {
        accessToken,
        ...user,
        password: undefined,
      };
    } catch (error) {
      console.log('error: ', error);
      throw new BadRequestException(error);
    }
  }
  checkToken(token: string) {
    try {
      const data = this.JWTService.verify(token);
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('Wrong email or password');

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) throw new UnauthorizedException('Wrong email or password');
    return this.createToken(user);
  }

  async register(body: AuthRegisterDTO) {
    const user = await this.userService.create(body);
    return this.createToken(user);
  }
}
