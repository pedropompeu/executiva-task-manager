import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Este email já está em uso.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInUserDto: SignInUserDto): Promise<{ accessToken: string }> {
    const { email, password } = signInUserDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Credenciais inválidas. Por favor, verifique o seu email e senha.');
    }
  }
}