import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInUserDto {
  @IsEmail({},{message: 'Por favor, insira um email válido.'})
  @IsNotEmpty({message: 'O email é obrigatório.'})
  email: string;

  @IsString()
  @IsNotEmpty({message: 'A senha é obrigatória.'})
    password: string;
}

