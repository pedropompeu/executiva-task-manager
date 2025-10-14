import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }
  @HttpCode(HttpStatus.OK)

  @Post('/signin')
  signIn(@Body() signInUserDto: SignInUserDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInUserDto);
  }
} 