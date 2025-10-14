import { IsEmail, IsNotEmpty, Min, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail({},{message: 'Por favor, insira um email válido.'})
    @IsNotEmpty({message: 'O email é obrigatório.'})
  email: string;

    @MinLength(6, {message: 'A password deve ter pelo menos 6 caracteres.'})
    @IsNotEmpty({message: 'A password é obrigatória.'})
    password: string;
    }

    