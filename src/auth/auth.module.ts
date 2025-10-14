import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: 'Admin@123',
    signOptions: { expiresIn: '1h' },
  }),
],

  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
